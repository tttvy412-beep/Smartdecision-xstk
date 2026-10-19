import {mkdir,cp,copyFile,rm,readFile,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname),out=join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await copyFile(join(root,'index.html'),join(out,'index.html'));
await copyFile(join(root,'styles.css'),join(out,'styles.css'));
await cp(join(root,'src'),join(out,'src'),{recursive:true});
for(const f of ['index.html','styles.css','src/app.mjs','src/core.mjs']){const s=await stat(join(out,f));if(!s.size)throw Error(`File rỗng: ${f}`);}
const text=await readFile(join(out,'index.html'),'utf8');if(!text.includes('src/app.mjs'))throw Error('Trang web thiếu entrypoint');
console.log('✓ Static production build: dist/ (không cần tải npm packages)');
