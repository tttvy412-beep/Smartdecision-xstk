// Authenticated Supabase client: publishable key only, NEVER embed a service-role key.
export class RetailCloud {
  constructor(config=globalThis.__RETAILMIND_CONFIG__||{}) {
    this.url=String(config.url||'').replace(/\/$/,'');
    this.key=String(config.publishableKey||'');
    this.session=null;this.user=null;this.org=null;this.version=0;this.pending=0;
    try { this.session=JSON.parse(sessionStorage.getItem('retailmind_auth_v7')||'null'); }catch{}
  }
  get configured(){return this.url.startsWith('https://') && this.key.length>15;}
  get signedIn(){return Boolean(this.session?.access_token && this.user);}
  async request(path, {method='GET',body,auth=true,raw=false,headers={}}={}) {
    if(!this.configured)throw Error('Chưa cấu hình Supabase URL và publishable key trên Netlify.');
    if(auth && this.session?.expires_at && Date.now()/1000>this.session.expires_at-60)await this.refresh();
    const h={'apikey':this.key,...headers};
    if(auth&&this.session?.access_token)h.Authorization='Bearer '+this.session.access_token;
    if(body!==undefined && !(body instanceof Blob))h['Content-Type']='application/json';
    const res=await fetch(this.url+path,{method,headers:h,body:body===undefined?undefined:body instanceof Blob?body:JSON.stringify(body)});
    if(raw)return res;
    const txt=await res.text();let out={};try{out=txt?JSON.parse(txt):{};}catch{out={message:txt};}
    if(!res.ok)throw Error(out.msg||out.message||out.error_description||out.error||`Supabase HTTP ${res.status}`);
    return out;
  }
  keepSession(s){this.session=s?.access_token?{...s,expires_at:Math.floor(Date.now()/1000)+(s.expires_in||3600)}:null;
    try {if(this.session)sessionStorage.setItem('retailmind_auth_v7',JSON.stringify(this.session));else sessionStorage.removeItem('retailmind_auth_v7');}catch{}
  }
  async refresh(){if(!this.session?.refresh_token)throw Error('Phiên đăng nhập đã hết hạn.');
    const s=await this.request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:this.session.refresh_token},auth:false});this.keepSession(s);return s;
  }
  async restore(){if(!this.session)return false;
    try{if(this.session.expires_at<Date.now()/1000+60)await this.refresh();this.user=await this.request('/auth/v1/user');return true;}
    catch{this.keepSession(null);this.user=null;return false;}
  }
  async signup(email,password){return this.request('/auth/v1/signup',{method:'POST',body:{email,password,data:{source:'RetailMind'}},auth:false});}
  async login(email,password){const s=await this.request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},auth:false});this.keepSession(s);this.user=await this.request('/auth/v1/user');return this.user;}
  async recover(email,redirectTo){return this.request('/auth/v1/recover?redirect_to='+encodeURIComponent(redirectTo),{method:'POST',body:{email},auth:false});}
  async updatePassword(password){return this.request('/auth/v1/user',{method:'PUT',body:{password}});}
  async logout(){try{await this.request('/auth/v1/logout',{method:'POST'});}catch{}this.keepSession(null);this.user=null;this.org=null;this.version=0;}
  async rpc(name,body){return this.request('/rest/v1/rpc/'+name,{method:'POST',body});}
  async organizations(){const rows=await this.request('/rest/v1/rm_memberships?select=organization_id,role,rm_organizations(id,name)&user_id=eq.'+encodeURIComponent(this.user.id));
    return rows.map(row=>({...row.rm_organizations,role:row.role})).filter(x=>x?.id);
  }
  async createOrganization(name,initialState){return this.rpc('rm_create_organization',{p_name:name,p_state:initialState});}
  async joinOrganization(code){return this.rpc('rm_join_with_invite',{p_code:code});}
  async createInvite(){if(!this.org)throw Error('Chưa chọn doanh nghiệp.');return this.rpc('rm_create_invite',{p_organization_id:this.org.id});}
  async rename(name){return this.rpc('rm_rename_organization',{p_org:this.org.id,p_name:name});}
  async loadOrganization(org){const id=org.id;const rows=await this.request('/rest/v1/rm_company_state?select=organization_id,payload,version&organization_id=eq.'+encodeURIComponent(id));
    if(!rows.length)throw Error('Không thể đọc dữ liệu doanh nghiệp; kiểm tra quyền truy cập.');this.org=org;this.version=Number(rows[0].version);return rows[0].payload;
  }
  async saveState(payload){if(!this.org)throw Error('Chưa chọn doanh nghiệp.');
    const n=await this.rpc('rm_save_company_state',{p_org:this.org.id,p_state:payload,p_expected_version:this.version});this.version=Number(n);return this.version;
  }
  async uploadFile(file,type='evidence'){
    if(!this.org)throw Error('Chưa chọn doanh nghiệp.');
    if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)||file.size>6*1024*1024)throw Error('Chỉ hỗ trợ ảnh/PDF tối đa 6MB.');
    const extension=file.type==='application/pdf'?'pdf':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
    const path=`${this.org.id}/${type}/${crypto.randomUUID()}.${extension}`;
    const response=await this.request('/storage/v1/object/retailmind-files/'+path,{method:'POST',body:file,headers:{'Content-Type':file.type,'x-upsert':'false'},raw:true});
    if(!response.ok)throw Error('Không thể tải file lên Supabase Storage ('+response.status+').');
    return {path,name:file.name,mime:file.type,date:new Date().toISOString()};
  }
  async fileUrl(path){const r=await this.request('/storage/v1/object/sign/retailmind-files/'+path,{method:'POST',body:{expiresIn:180}});return this.url+'/storage/v1'+r.signedURL;}
}
