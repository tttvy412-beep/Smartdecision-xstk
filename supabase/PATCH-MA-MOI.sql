-- RETAILMIND v9.3 — VÁ LỖI "Tạo mã mời" (chạy MỘT LẦN trong Supabase → SQL Editor).
-- Nguyên nhân: hàm cũ gọi gen_random_bytes() (pgcrypto, nằm ở schema "extensions") trong khi hàm đặt search_path rỗng
-- nên Postgres báo "function gen_random_bytes(integer) does not exist". Bản vá dùng gen_random_uuid() (hàm lõi).
-- An toàn khi chạy lại; không đụng tới dữ liệu doanh nghiệp.
create or replace function public.rm_create_invite(p_organization_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare code text;
begin
 if auth.uid() is null or not public.rm_manager(p_organization_id) then raise exception 'Không có quyền mời thành viên'; end if;
 code:=replace(gen_random_uuid()::text,'-','')||substr(replace(gen_random_uuid()::text,'-',''),1,8);
 insert into public.rm_invites(organization_id,invite_code,created_by,expires_at,max_uses)
 values(p_organization_id,code,auth.uid(),now()+interval '7 days',10);
 return code;
end $$;
revoke all on function public.rm_create_invite(uuid) from public;
grant execute on function public.rm_create_invite(uuid) to authenticated;
notify pgrst, 'reload schema';
