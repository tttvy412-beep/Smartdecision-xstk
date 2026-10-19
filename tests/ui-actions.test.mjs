import test from 'node:test';import assert from 'node:assert/strict';
const hooks={},els={'app':{innerHTML:''},'modal-slot':{innerHTML:''},'toast':{className:'',textContent:''}};
const store=new Map();
globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
globalThis.document={title:'',getElementById:id=>els[id]||null,addEventListener:(id,fn)=>{hooks[id]=fn;},querySelector:()=>null};
globalThis.window={scrollTo(){}};
globalThis.FormData=class{constructor(form){this.pairs=form.pairs||Object.entries(form.fields||{});}entries(){return this.pairs[Symbol.iterator]();}getAll(key){return this.pairs.filter(([k])=>k===key).map(([,v])=>v);}};
await import('../src/app.mjs');
const state=()=>JSON.parse(store.get('smartdecision_v3_main'));
const click=action=>{const x={dataset:{action},classList:{contains(){return false;}}};const target={closest(sel){return sel==='[data-action]'?x:null;}};hooks.click({target});};
const send=(id,fields)=>hooks.submit({preventDefault(){},target:{id,fields}});
test('Tạo đơn hoàn thành qua giao diện thì tồn kho giảm, sửa trạng thái hoàn kho',()=>{
 click('new-order');assert.match(els['modal-slot'].innerHTML,/Tạo đơn hàng liên kết kho/);
 send('new-order-form',{customerId:'KH01',productId:'SP01',quantity:'2',status:'Hoàn thành'});
 let s=state();assert.equal(s.products.find(p=>p.id==='SP01').stock,40);const id=s.orders[0].id;
 hooks.change({target:{matches(sel){return sel==='[data-order-status]';},dataset:{orderStatus:id},value:'Đã hủy'}});
 s=state();assert.equal(s.products.find(p=>p.id==='SP01').stock,42);assert.equal(s.orders[0].status,'Đã hủy');
});
test('Phiếu nhập và thanh toán giao diện cập nhật công nợ, không ảnh hưởng sai số lợi nhuận',()=>{
 click('receive');send('receive-form',{supplierId:'NCC01',productId:'SP01',quantity:'5',unitCost:'100000',paid:'100000'});
 let s=state();assert.equal(s.products.find(p=>p.id==='SP01').stock,47);assert.equal(s.purchases[0].total,500000);assert.equal(s.purchases[0].paid,100000);
 const before=s.expenses.length;click('pay');send('pay-form',{purchaseId:s.purchases[0].id,amount:'150000'});s=state();assert.equal(s.purchases[0].paid,250000);assert.equal(s.expenses.length,before);
});
test('Ghi chi phí tạo thay đổi dữ liệu và cập nhật tên doanh nghiệp',()=>{
 click('new-expense');send('expense-form',{name:'Bảo trì máy',category:'Vận hành',amount:'75000',date:'2026-10-20'});
 let s=state();assert.equal(s.expenses[0].name,'Bảo trì máy');
 send('settings-form',{name:'Cửa hàng Sao Biển',sector:'Phụ kiện',phone:'',email:'',address:'TP HCM'});
 s=state();assert.equal(s.company.name,'Cửa hàng Sao Biển');assert.match(els.app.innerHTML,/Cửa hàng Sao Biển/);
});
