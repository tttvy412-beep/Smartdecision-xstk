-- RETAILMIND v7: database for authenticated, separate enterprise workspaces.
-- Execute as the project owner in Supabase SQL Editor. Does not alter the six demo tables.
create extension if not exists pgcrypto;

create table if not exists public.rm_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
create table if not exists public.rm_memberships (
  organization_id uuid not null references public.rm_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  joined_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);
create index if not exists rm_memberships_user_idx on public.rm_memberships(user_id);
create table if not exists public.rm_company_state (
  organization_id uuid primary key references public.rm_organizations(id) on delete cascade,
  payload jsonb not null,
  version bigint not null default 1 check(version > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create table if not exists public.rm_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.rm_organizations(id) on delete cascade,
  invite_code text unique not null,
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  max_uses int not null default 10 check(max_uses between 1 and 100),
  uses int not null default 0 check(uses >= 0),
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER helper avoids recursive membership RLS policies.
create or replace function public.rm_member(p_org uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.rm_memberships m where m.organization_id=p_org and m.user_id=(select auth.uid())) $$;
create or replace function public.rm_manager(p_org uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.rm_memberships m where m.organization_id=p_org and m.user_id=(select auth.uid()) and m.role in ('owner','admin')) $$;

alter table public.rm_organizations enable row level security;
alter table public.rm_memberships enable row level security;
alter table public.rm_company_state enable row level security;
alter table public.rm_invites enable row level security;

-- Allow read-only access only within membership; all writes through validated RPCs.
drop policy if exists rm_org_read on public.rm_organizations;
create policy rm_org_read on public.rm_organizations for select to authenticated using (public.rm_member(id));
drop policy if exists rm_member_read on public.rm_memberships;
create policy rm_member_read on public.rm_memberships for select to authenticated using (public.rm_member(organization_id));
drop policy if exists rm_state_read on public.rm_company_state;
create policy rm_state_read on public.rm_company_state for select to authenticated using (public.rm_member(organization_id));
-- No policy grants INSERT / UPDATE / DELETE to API clients.
revoke all on public.rm_organizations, public.rm_memberships, public.rm_company_state, public.rm_invites from anon, authenticated;
grant select on public.rm_organizations, public.rm_memberships, public.rm_company_state to authenticated;

create or replace function public.rm_create_organization(p_name text, p_state jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare org uuid; who uuid := auth.uid();
begin
 if who is null then raise exception 'Cần đăng nhập'; end if;
 if length(trim(coalesce(p_name,''))) not between 2 and 120 then raise exception 'Tên doanh nghiệp cần từ 2 đến 120 ký tự'; end if;
 if p_state is null or jsonb_typeof(p_state) <> 'object' or octet_length(p_state::text)>2097152 then raise exception 'Dữ liệu doanh nghiệp không hợp lệ'; end if;
 insert into public.rm_organizations(name,created_by) values(trim(p_name),who) returning id into org;
 insert into public.rm_memberships(organization_id,user_id,role) values(org,who,'owner');
 insert into public.rm_company_state(organization_id,payload,version,updated_by) values(org,p_state,1,who);
 return org;
end $$;

create or replace function public.rm_create_invite(p_organization_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare code text;
begin
 if auth.uid() is null or not public.rm_manager(p_organization_id) then raise exception 'Không có quyền mời thành viên'; end if;
 -- gen_random_uuid() là hàm lõi (pg_catalog) nên chạy được với search_path rỗng; gen_random_bytes của pgcrypto thì không.
 code:=replace(gen_random_uuid()::text,'-','')||substr(replace(gen_random_uuid()::text,'-',''),1,8);
 insert into public.rm_invites(organization_id,invite_code,created_by,expires_at,max_uses)
 values(p_organization_id,code,auth.uid(),now()+interval '7 days',10);
 return code;
end $$;

create or replace function public.rm_join_with_invite(p_code text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare org uuid; who uuid:=auth.uid();
begin
 if who is null then raise exception 'Cần đăng nhập'; end if;
 -- Row lock prevents concurrent use beyond invitation limit.
 select i.organization_id into org from public.rm_invites i
 where i.invite_code=trim(p_code) and i.expires_at>now() and i.uses<i.max_uses for update;
 if org is null then raise exception 'Mã mời không hợp lệ hoặc đã hết hạn'; end if;
 if exists(select 1 from public.rm_memberships where organization_id=org and user_id=who) then return org; end if;
 update public.rm_invites set uses=uses+1 where invite_code=trim(p_code);
 insert into public.rm_memberships(organization_id,user_id,role) values(org,who,'member');
 return org;
end $$;

create or replace function public.rm_save_company_state(p_org uuid,p_state jsonb,p_expected_version bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_version bigint;
begin
 if auth.uid() is null or not public.rm_member(p_org) then raise exception 'Không có quyền truy cập doanh nghiệp'; end if;
 if p_state is null or jsonb_typeof(p_state) <> 'object' or octet_length(p_state::text)>2097152 then raise exception 'Dữ liệu không hợp lệ hoặc vượt 2MB'; end if;
 update public.rm_company_state set payload=p_state, version=version+1,updated_at=now(),updated_by=auth.uid()
 where organization_id=p_org and version=p_expected_version
 returning version into new_version;
 if new_version is null then raise exception 'CONFLICT_VERSION: Dữ liệu đã thay đổi từ thiết bị khác, vui lòng tải lại'; end if;
 return new_version;
end $$;

create or replace function public.rm_rename_organization(p_org uuid,p_name text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not public.rm_manager(p_org) then raise exception 'Cần quyền quản trị để đổi tên doanh nghiệp'; end if;
 if length(trim(coalesce(p_name,''))) not between 2 and 120 then raise exception 'Tên doanh nghiệp không hợp lệ'; end if;
 update public.rm_organizations set name=trim(p_name) where id=p_org;
end $$;

revoke all on function public.rm_member(uuid),public.rm_manager(uuid),public.rm_create_organization(text,jsonb),public.rm_create_invite(uuid),public.rm_join_with_invite(text),public.rm_save_company_state(uuid,jsonb,bigint),public.rm_rename_organization(uuid,text) from public;
grant execute on function public.rm_member(uuid),public.rm_manager(uuid),public.rm_create_organization(text,jsonb),public.rm_create_invite(uuid),public.rm_join_with_invite(text),public.rm_save_company_state(uuid,jsonb,bigint),public.rm_rename_organization(uuid,text) to authenticated;

-- Private evidence/images; object keys are always prefixed with the authenticated organization id.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('retailmind-files','retailmind-files',false,6291456,array['image/jpeg','image/png','image/webp','application/pdf'])
 on conflict (id) do update set public=false,file_size_limit=6291456,allowed_mime_types=array['image/jpeg','image/png','image/webp','application/pdf'];
drop policy if exists rm_files_select on storage.objects;
create policy rm_files_select on storage.objects for select to authenticated
using(bucket_id='retailmind-files' and public.rm_member(((storage.foldername(name))[1])::uuid));
drop policy if exists rm_files_insert on storage.objects;
create policy rm_files_insert on storage.objects for insert to authenticated
with check(bucket_id='retailmind-files' and public.rm_member(((storage.foldername(name))[1])::uuid));
drop policy if exists rm_files_delete on storage.objects;
create policy rm_files_delete on storage.objects for delete to authenticated
using(bucket_id='retailmind-files' and public.rm_manager(((storage.foldername(name))[1])::uuid));
-- Existing six SmartDecision demo tables are intentionally untouched.
