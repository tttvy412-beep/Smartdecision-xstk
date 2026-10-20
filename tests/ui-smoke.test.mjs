import test from 'node:test';import assert from 'node:assert/strict';
const callbacks={};const main={innerHTML:''};
const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)||null,setItem:(k,v)=>store.set(k,v)};
globalThis.document={title:'',getElementById(id){return id==='app'?main:null;},addEventListener(event,cb){callbacks[event]=cb;},querySelector(){return null;}};
globalThis.window={scrollTo(){}};
const ids=['dashboard','orders','products','inventory','suppliers','customers','finance','analytics','forecast','scenarios','ranking','decisions','settings'];
await import('../src/app.mjs');
function clickNav(id){const target={closest(sel){return sel==='[data-go]'?{dataset:{go:id}}:null;}};callbacks.click({target});}
test('Trang tổng quan xuất hiện và có tên doanh nghiệp',()=>{assert.match(main.innerHTML,/RetailMind/);assert.match(main.innerHTML,/Cửa hàng Minh Họa/);});
test('13 màn hình chức năng đều render được, không lỗi JS',()=>{for(const id of ids){assert.doesNotThrow(()=>clickNav(id),`Lỗi trang ${id}`);assert.match(main.innerHTML, new RegExp(`data-go="${id}"`));assert.match(main.innerHTML, /page-content/);} });
test('Từng màn hình là một nghiệp vụ khác nhau',()=>{const anchors=['Tổng quan','Danh sách đơn hàng','Danh mục sản phẩm','Nhật ký nhập','Chứng từ mua hàng','Giá trị khách hàng','Tài chính & báo cáo','Đóng góp doanh thu','Dự báo nhu cầu','Mô phỏng & mục tiêu lợi nhuận','Ma trận đánh giá','Hồ sơ quyết định','Thông tin doanh nghiệp'];const snapshots=[];ids.forEach(id=>{clickNav(id);snapshots.push(main.innerHTML);});anchors.forEach((word,i)=>assert.ok(snapshots[i].includes(word),`Trang ${ids[i]} thiếu ${word}`));});
