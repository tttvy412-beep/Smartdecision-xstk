import test from 'node:test';
import assert from 'node:assert/strict';
import {baseState, productCreate,receiveStock,payPurchase,procurementSummary,financials,createOrder,updateOrderStatus,scoreSuppliers} from '../src/core.mjs';
const base=()=>{
 const s=baseState();s.suppliers=[{id:'N1',name:'A'},{id:'N2',name:'B'}];s.customers=[{id:'C1',name:'Khách 1'}];return s;
};
function added(){return productCreate(base(),{sku:'SP-F',name:'Bút',category:'Văn phòng phẩm',price:160000,min:5,supplierId:'N1'});}
test('v4: thêm sản phẩm chọn danh mục không đòi nhập giá vốn',()=>{const s=added();assert.equal(s.products[0].category,'Văn phòng phẩm');assert.equal(s.products[0].cost,0);assert.equal(s.products[0].stock,0);});
test('v4: phí của đơn vị vận chuyển không đội công nợ nhà cung cấp, không thành chi phí hoạt động',()=>{
 const initial=added(),pid=initial.products[0].id;
 const s=receiveStock(initial,{supplierId:'N1',productId:pid,quantity:10,unitCost:100000,freight:100000,handling:50000,paid:400000});
 assert.equal(s.products[0].stock,10);assert.equal(s.products[0].cost,115000);
 assert.equal(s.products[0].lastPurchasePrice,100000);
 assert.equal(s.purchases[0].merchandiseTotal,1000000);
 assert.equal(s.purchases[0].landedTotal,1150000);
 assert.equal(s.purchases[0].total,1000000);assert.equal(s.purchases[0].paid,400000);
 assert.equal(procurementSummary(s).debtOutstanding,600000);
 assert.equal(procurementSummary(s).paidExternal,150000);
 assert.equal(financials(s).expenses,0);assert.equal(financials(s).net,0);
});
test('v4: phí do nhà cung cấp thu được tính vào công nợ',()=>{
 const s0=added(),id=s0.products[0].id;
 const s=receiveStock(s0,{supplierId:'N1',productId:id,quantity:10,unitCost:100000,freight:100000,handling:50000,feesBilledBySupplier:'yes',paid:400000});
 assert.equal(s.purchases[0].total,1150000);
 assert.equal(procurementSummary(s).debtOutstanding,750000);
 assert.equal(procurementSummary(s).paidExternal,0);
 const t=payPurchase(s,{purchaseId:s.purchases[0].id,amount:750000});assert.equal(procurementSummary(t).debtOutstanding,0);
 assert.equal(t.products[0].cost,115000);
});
test('v4: hóa đơn nhập cập nhật giá mua gần nhất; nhập lô sau bình quân không ghi đè giá vốn đơn cũ',()=>{
 const init=added(),id=init.products[0].id;
 const s=receiveStock(init,{supplierId:'N1',productId:id,quantity:10,unitCost:100000,freight:100000,paid:0});
 const t=createOrder(s,{customerId:'C1',status:'Hoàn thành',lines:[{productId:id,quantity:2}]});
 assert.equal(t.orders[0].lines[0].cost,110000);assert.equal(t.products[0].stock,8);
 const u=receiveStock(t,{supplierId:'N2',productId:id,quantity:10,unitCost:120000,freight:0,paid:0});
 assert.equal(u.products[0].cost,Math.round((8*110000+10*120000)/18));
 assert.equal(u.products[0].supplierId,'N1');assert.equal(u.products[0].lastPurchasePrice,120000);
 assert.equal(u.orders[0].lines[0].cost,110000);
 assert.equal(financials(u).cogsKnown,220000);
 const v=updateOrderStatus(u,u.orders[0].id,'Đã hủy');assert.equal(financials(v).revenue,0);
});
test('v4: chỉ nhà cung cấp được chấm điểm mới tham gia xếp hạng DSS',()=>{
 const s=base();assert.deepEqual(scoreSuppliers(s),[]);
 s.ratings={N1:{price:5,delivery:3,quality:4}};
 assert.equal(scoreSuppliers(s).length,1);assert.equal(scoreSuppliers(s)[0].id,'N1');
});
