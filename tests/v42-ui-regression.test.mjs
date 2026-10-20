import test from 'node:test';
import assert from 'node:assert/strict';
const callbacks={};const elements={'app':{innerHTML:''},'modal-slot':{innerHTML:''},'toast':{className:'',textContent:''}};
const store=new Map();
globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
globalThis.document={title:'',getElementById:id=>elements[id]||null,querySelector(){return null;},addEventListener:(event,fn)=>{callbacks[event]=fn;}};
globalThis.window={scrollTo(){}};
globalThis.requestAnimationFrame=(fn)=>fn();
globalThis.FormData=class {constructor(f){this.pairs=Object.entries(f?.fields||{});}entries(){return this.pairs[Symbol.iterator]();}get(k){return this.pairs.find(([x])=>x===k)?.[1]||null;}getAll(k){return this.pairs.filter(([x])=>x===k).map(([,v])=>v);}};
const clickAction=(action,id='')=>{const item={dataset:{action,id},classList:{contains:()=>false}};callbacks.click({target:{closest(sel){return sel==='[data-action]'?item:null;}}});};
const clickPage=(id)=>callbacks.click({target:{closest(sel){return sel==='[data-go]'?{dataset:{go:id}}:null;}}});
await import('../src/app.mjs');
test('Danh mục sản phẩm không có nút Nhập thêm, dùng đúng nghiệp vụ kho',()=>{
 clickPage('products'); assert.doesNotMatch(elements.app.innerHTML,/data-action="buy-product"/);
 assert.match(elements.app.innerHTML,/data-action="edit-product"/);
});
test('Nhà cung cấp và phiếu nhập cùng màu chủ đạo',()=>{
 clickPage('suppliers');
 assert.match(elements.app.innerHTML,/class="btn primary" data-action="new-supplier"/);
 assert.match(elements.app.innerHTML,/class="btn primary" data-action="receive"/);
});
test('Ghi chi phí cho phép bổ sung danh mục mới thay vì bắt chọn Khác',()=>{
 clickAction('new-expense');const html=elements['modal-slot'].innerHTML;
 assert.match(html,/name="expenseCategoryChoice"/);assert.match(html,/＋ Thêm nhóm chi phí mới/);
 assert.match(html,/name="newExpenseCategory"/);
 callbacks.submit({preventDefault(){},target:{id:'expense-form',fields:{name:'Bảo trì máy lạnh',expenseCategoryChoice:'__new__',newExpenseCategory:'Bảo trì',amount:'50000',date:'2026-10-20'}}});
 const data=JSON.parse(store.get('smartdecision_v3_main'));
 assert.equal(data.expenses[0].category,'Bảo trì');
});
test('Phiếu nhập và thanh toán có chọn chứng từ ảnh/PDF',()=>{
 clickAction('receive');assert.match(elements['modal-slot'].innerHTML,/name="evidence"/);
 clickAction('pay');assert.match(elements['modal-slot'].innerHTML,/name="evidence"/);
});
test('Thẻ C dư thừa biến mất, micro là icon SVG đúng',()=>{
 assert.doesNotMatch(elements.app.innerHTML,/class="avatar"/);
 clickAction('toggle-chat');
 assert.match(elements.app.innerHTML,/class="chat-mic"/);
 assert.match(elements.app.innerHTML,/viewBox="0 0 24 24"/);
 assert.match(elements.app.innerHTML,/data-action="chat-to-decision"/);
});
test('Tài chính hiển thị khoản chi tiền hàng không tính hai lần trong lợi nhuận',()=>{
 clickPage('finance');
 assert.match(elements.app.innerHTML,/TỔNG TIỀN ĐÃ CHI/);
 assert.match(elements.app.innerHTML,/không làm giảm ngay lợi nhuận/);
});
