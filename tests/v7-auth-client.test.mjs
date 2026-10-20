import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RetailCloud} from '../src/cloud.mjs';

test('v7: auth client authenticates and scopes access to chosen business', async()=>{
 const previousFetch=globalThis.fetch, previousSession=globalThis.sessionStorage;
 const store=new Map();
 globalThis.sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const calls=[];
 globalThis.fetch=async(url,options={})=>{
  calls.push({url,options});
  let body=[];
  if(url.endsWith('grant_type=password'))body={access_token:'test-user-token',refresh_token:'refresh-test',expires_in:3600};
  else if(url.endsWith('/auth/v1/user'))body={id:'user-001',email:'owner@example.test'};
  else if(url.includes('rm_memberships?'))body=[{organization_id:'org-A',role:'owner',rm_organizations:{id:'org-A',name:'Cửa hàng A'}}];
  else if(url.includes('rm_company_state?'))body=[{organization_id:'org-A',payload:{company:{name:'Cửa hàng A'}},version:2}];
  else if(url.endsWith('/rpc/rm_save_company_state'))body=3;
  return {ok:true,status:200,text:async()=>JSON.stringify(body)};
 };
 try{
  const c=new RetailCloud({url:'https://demo.supabase.co',publishableKey:'sb_publishable_test'});
  const user=await c.login('owner@example.test','testpassword');
  assert.equal(user.id,'user-001');
  const orgs=await c.organizations();assert.equal(orgs.length,1);assert.equal(orgs[0].id,'org-A');
  const content=await c.loadOrganization(orgs[0]);assert.equal(content.company.name,'Cửa hàng A');
  await c.saveState({company:{name:'Cửa hàng A'}});
  assert.equal(c.version,3);
  assert.ok(calls.some(x=>x.url.includes('organization_id=eq.org-A')));
  const rpc=calls.find(x=>x.url.endsWith('/rpc/rm_save_company_state'));
  assert.equal(JSON.parse(rpc.options.body).p_expected_version,2);
  assert.equal(rpc.options.headers.Authorization,'Bearer test-user-token');
 }finally{globalThis.fetch=previousFetch;globalThis.sessionStorage=previousSession;}
});

test('v7: schema enables RLS, keeps legacy demo tables separate',()=>{
 const sql=readFileSync(new URL('../supabase/SETUP-RETAILMIND.sql',import.meta.url),'utf8');
 for(const table of ['rm_organizations','rm_memberships','rm_company_state','rm_invites'])assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`));
 assert.match(sql,/public\.rm_member\(organization_id\)/);
 assert.doesNotMatch(sql,/alter table public\.(products|orders|customers|expenses|suppliers|decisions)/);
});
