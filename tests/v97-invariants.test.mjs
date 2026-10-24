import test from 'node:test';
import assert from 'node:assert/strict';
import {seedDemo,validateData,createOrder,updateOrderStatus,payOrder,refundOrder,receiveStock,createPurchaseOrder,purchaseReceive,payPurchase,expenseSave,auditStock,financials,customerReceivables,procurementSummary,supplierDebt,orderPaid,baseState} from '../src/core.mjs';
// Deterministic PRNG so failures are reproducible.
const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
function invariants(s,label){
 for(const p of s.products)assert.ok(p.stock>=0,`${label}: tồn âm ${p.sku}=${p.stock}`);
 assert.ok(customerReceivables(s)>=-0.5,`${label}: phải thu âm`);
 const proc=procurementSummary(s);assert.ok(proc.debtOutstanding>=-0.5,`${label}: nợ NCC âm`);
 for(const sup of s.suppliers)assert.ok(supplierDebt(s,sup.id)>=-0.5,`${label}: nợ ${sup.name} âm`);
 for(const o of s.orders){const paid=orderPaid(o);assert.ok(paid>=-0.5,`${label}: đã thu âm ${o.id}`);if(o.status==='Đã hủy')assert.ok(Math.abs(paid)<0.5,`${label}: đơn hủy còn tiền ${o.id}`);assert.ok(paid<=o.total+0.5,`${label}: thu vượt hóa đơn ${o.id}`);}
 const f=financials(s);if(f.net!==null&&f.knownAfterCosts!==undefined)assert.ok(Number.isFinite(f.knownAfterCosts),`${label}: lợi nhuận không hữu hạn`);
 validateData(s);
}
for(const seed of [1,7,42,2026,9001]){
 test(`bất biến nghiệp vụ ngẫu nhiên (seed ${seed}): kho, công nợ, thu tiền không bao giờ sai`,()=>{
  const r=rng(seed);let s=seedDemo();invariants(s,'khởi tạo');
  const pick=a=>a[Math.floor(r()*a.length)];
  for(let step=0;step<120;step++){
   const op=Math.floor(r()*8);let next=s;
   try{
    if(op===0&&s.products.length){const p=pick(s.products);next=createOrder(s,{customerId:s.customers[0]?.id,status:pick(['Đang xử lý','Hoàn thành']),lines:[{productId:p.id,quantity:1+Math.floor(r()*4)}]});}
    else if(op===1&&s.orders.length){const o=pick(s.orders);next=updateOrderStatus(s,o.id,pick(['Đang xử lý','Hoàn thành','Đã hủy']));}
    else if(op===2&&s.orders.length){const o=pick(s.orders);next=payOrder(s,{orderId:o.id,amount:Math.round(1000+r()*200000),method:'Tiền mặt'});}
    else if(op===3&&s.orders.length){const o=pick(s.orders);next=refundOrder(s,{orderId:o.id,amount:orderPaid(o)});}
    else if(op===4&&s.products.length&&s.suppliers.length){const p=pick(s.products);const sp=pick(s.suppliers.filter(x=>!x.type||x.type==='Hàng hóa')||s.suppliers);next=receiveStock(s,{supplierId:sp.id,productId:p.id,quantity:1+Math.floor(r()*20),unitCost:1000+Math.floor(r()*90000),paid:Math.floor(r()*100000)});}
    else if(op===5&&s.purchases?.length){const pu=pick(s.purchases);next=payPurchase(s,{purchaseId:pu.id,amount:Math.round(1000+r()*100000),reference:'T'+step});}
    else if(op===6&&s.products.length){const p=pick(s.products);next=auditStock(s,{productId:p.id,actual:Math.floor(r()*80),reason:'kiểm thử'});}
    else if(op===7){next=expenseSave(s,{name:'Chi phí thử',category:'Vận hành',amount:Math.round(1000+r()*500000),date:'2026-10-20'});}
   }catch{next=s;} // thao tác hợp lệ bị từ chối là hành vi đúng
   s=next;invariants(s,`seed ${seed} bước ${step} op ${op}`);
  }
 });
}
test('bảo toàn kho: tồn cuối = tồn đầu + nhập − bán (đơn không hủy, hoàn thành)',()=>{
 let s=baseState();s.products=[{id:'P1',sku:'A',name:'A',category:'Gia dụng',price:100000,cost:40000,stock:10,min:2}];s.customers=[{id:'K1',name:'K'}];s.suppliers=[{id:'N1',name:'N',type:'Hàng hóa'}];
 s=receiveStock(s,{supplierId:'N1',productId:'P1',quantity:20,unitCost:40000,paid:0});
 s=createOrder(s,{customerId:'K1',status:'Hoàn thành',lines:[{productId:'P1',quantity:7}]});const doneId=s.orders[0].id;
 s=createOrder(s,{customerId:'K1',status:'Đang xử lý',lines:[{productId:'P1',quantity:5}]});const openId=s.orders[0].id;
 assert.equal(s.products[0].stock,10+20-7);
 s=updateOrderStatus(s,openId,'Đã hủy');assert.equal(s.products[0].stock,10+20-7,'hủy đơn chưa hoàn thành không đổi kho');
 s=updateOrderStatus(s,doneId,'Đã hủy');assert.equal(s.products[0].stock,10+20,'hủy đơn đã hoàn thành trả lại kho');
 s=createOrder(s,{customerId:'K1',status:'Đang xử lý',lines:[{productId:'P1',quantity:5}]});const id3=s.orders[0].id;s=updateOrderStatus(s,id3,'Hoàn thành');assert.equal(s.products[0].stock,10+20-5);
});
