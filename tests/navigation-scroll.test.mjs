import test from 'node:test';
import assert from 'node:assert/strict';

const hooks = {};
let sidebar = {scrollLeft:0};
const app = {html:'',get innerHTML(){return this.html;},set innerHTML(value){this.html=value;sidebar={scrollLeft:0};}};
const els = {app,'modal-slot':{innerHTML:''},toast:{className:'',textContent:''}};
const storage = new Map();
globalThis.localStorage = {getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
globalThis.document = {
 title:'',
 getElementById:id=>els[id]||null,
 querySelector:selector=>selector==='.rm-dock-scroll'?sidebar:null,
 addEventListener:(name,callback)=>{hooks[name]=callback;}
};
let currentWindowY=0;
let scrollCalls=[];
globalThis.window={
 get scrollY(){return currentWindowY;},
 scrollTo(_x,y){currentWindowY=y;scrollCalls.push(y);}
};
await import('../src/app.mjs');
const clickPage=id=>hooks.click({target:{closest:selector=>selector==='[data-go]'?{dataset:{go:id}}:null}});

test('chuyển từ mục phía dưới giữ đúng vị trí cuộn menu bên trái',()=>{
 sidebar.scrollLeft=625;
 currentWindowY=150;
 clickPage('decisions');
 assert.equal(sidebar.scrollLeft,625);
 assert.equal(currentWindowY,150);
 assert.match(app.innerHTML,/Vòng đời quyết định/);
});

test('đổi qua lại các mục không khôi phục vị trí cũ gây nhảy lên đầu',()=>{
 sidebar.scrollLeft=700;
 currentWindowY=325;
 scrollCalls=[];
 clickPage('products');
 assert.equal(sidebar.scrollLeft,700);
 assert.equal(currentWindowY,325);
 assert.deepEqual(scrollCalls,[325]);
 currentWindowY=430;
 sidebar.scrollLeft=650;
 scrollCalls=[];
 clickPage('decisions');
 assert.equal(sidebar.scrollLeft,650);
 assert.equal(currentWindowY,430);
 assert.deepEqual(scrollCalls,[430]);
});

test('bấm lại mục hiện tại không dựng lại toàn bộ giao diện',()=>{
 const html=app.innerHTML;
 sidebar.scrollLeft=480;
 scrollCalls=[];
 clickPage('decisions');
 assert.equal(app.innerHTML,html);
 assert.equal(sidebar.scrollLeft,480);
 assert.deepEqual(scrollCalls,[]);
});
