import {mkdir,cp,copyFile,rm,readFile,stat,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname),out=join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await copyFile(join(root,'index.html'),join(out,'index.html'));
await copyFile(join(root,'styles.css'),join(out,'styles.css'));await copyFile(join(root,'styles-v9.css'),join(out,'styles-v9.css'));
await cp(join(root,'src'),join(out,'src'),{recursive:true});
await cp(join(root,'assets'),join(out,'assets'),{recursive:true});
// Only embed the SUPABASE PUBLISHABLE key, never a service-role / secret key.
// Legacy Netlify variables already use these VITE_-prefixed names.
const publicUrl=String(process.env.VITE_SUPABASE_URL||process.env.SUPABASE_URL||'').trim();
const publicKey=String(process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY||'').trim();
if(publicUrl && !/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/?$/.test(publicUrl))throw Error('Invalid public Supabase URL configuration');
if(publicKey && !/^(sb_publishable_|eyJ)/.test(publicKey))throw Error('A publishable/anon key is required; never use a secret key');
const config={url:publicUrl,publishableKey:publicKey};
await writeFile(join(out,'config.js'),`window.__RETAILMIND_CONFIG__ = ${JSON.stringify(config).replace(/</g,'\\u003c')};\n`);
if(!publicUrl || !publicKey)console.warn('! Public Supabase config is absent; sign-in will be unavailable until Netlify environment is set.');
for(const f of ['index.html','styles.css','src/app.mjs','src/core.mjs']){const s=await stat(join(out,f));if(!s.size)throw Error(`File rỗng: ${f}`);}
const text=await readFile(join(out,'index.html'),'utf8');if(!text.includes('src/app.mjs'))throw Error('Trang web thiếu entrypoint');
console.log('✓ Static production build: dist/ (không cần tải npm packages)');
