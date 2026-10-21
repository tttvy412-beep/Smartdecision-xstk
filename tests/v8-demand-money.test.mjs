import test from 'node:test';
import assert from 'node:assert/strict';
import {applyMoneyEdit,parseVnd} from '../src/money.mjs';
import {analyzeDemand} from '../src/demand.mjs';
const finished=(date,qty,id='A')=>({date,status:'Hoàn thành',lines:[{productId:id,quantity:qty}]});
test('typing 50000000 from empty input never repeats 5',()=>{
 let value='',caret=0;
 for(const c of '50000000'){
  const result=applyMoneyEdit(value,caret,caret,'insertText',c);
  value=result.value;caret=result.caret;
 }
 assert.equal(value,'50.000.000');assert.equal(parseVnd(value),'50000000');
});
test('backspace skips thousands separator and removes a digit',()=>{
 const a=applyMoneyEdit('50.000.000',3,3,'deleteContentBackward');
 assert.equal(a.value,'5.000.000');
});
test('middle caret insert and selected digits produce correct currency',()=>{
 assert.equal(applyMoneyEdit('12.000',2,2,'insertText','3').value,'123.000');
 assert.equal(applyMoneyEdit('1.230.000',2,5,'insertText','9').value,'19.000');
});
test('sparse sales must not pretend to be reliable forecasting',()=>{
 const s={orders:[finished('2026-10-05',4),finished('2026-10-06',1),finished('2026-10-08',2)]};
 const v=analyzeDemand(s,'A',10,5,new Date('2026-10-21T12:00:00Z'));
 assert.equal(v.sufficient,false);assert.equal(v.projected,null);assert.equal(v.reorder,null);
});
test('multi-period demand compares weighted recent sales',()=>{
 const dates=['2026-08-12','2026-08-21','2026-09-13','2026-09-25','2026-10-02','2026-10-15'];
 const s={orders:dates.map((date,i)=>finished(date,i+2))};
 const v=analyzeDemand(s,'A',1,2,new Date('2026-10-21T12:00:00Z'));
 assert.equal(v.sufficient,true);assert.equal(v.last30,18);assert.ok(v.projected>0);assert.equal(v.reorder,v.projected+1);
});
