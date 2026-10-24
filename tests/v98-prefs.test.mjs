import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
const auth=readFileSync(new URL('../src/auth-ui.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles-v9.css',import.meta.url),'utf8');
test('chế độ Tự động đã bị bỏ, mặc định luôn là Dịu',()=>{
 assert.match(app,/MODE_ORDER=\['light','soft','dark'\]/);
 assert.doesNotMatch(app,/prefers-color-scheme/);assert.doesNotMatch(html,/prefers-color-scheme/);
 assert.doesNotMatch(auth,/'auto'/);
 assert.match(app,/readPref\('retailmind_mode',\['light','soft','dark'\],'soft'\)/);
});
test('cỡ chữ mặc định Vừa, có 3 mức khác biệt rõ và được lưu',()=>{
 assert.match(app,/readPref\('retailmind_font',\['small','medium','large'\],'medium'\)/);
 assert.match(css,/data-font="small"\]\{zoom:\.88\}/);assert.match(css,/data-font="large"\]\{zoom:1\.2\}/);
 assert.match(app,/localStorage\.setItem\('retailmind_'\+type,value\)/);
 assert.match(auth,/data-preference="font"/);
});
test('bảng trên điện thoại chuyển thành thẻ và dòng không chuyển trắng ở chế độ tối',()=>{
 assert.match(app,/function labelTables/);assert.match(css,/@media \(max-width:700px\)\{\s*\.table-scroll\{overflow:visible\}/);
 assert.match(css,/html\[data-mode="dark"\] \.rm-page table tbody tr:hover td/);
 assert.match(css,/html\[data-mode="dark"\] \.lg-choose\{/);
});
