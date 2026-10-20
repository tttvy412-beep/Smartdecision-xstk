import test from 'node:test';
import assert from 'node:assert/strict';
import {parseVnd,formatVndInput,formatMoneyElement,normalizeMoneyFields} from '../src/money.mjs';
test('nhập tiền có dấu chấm ngay khi gõ, dùng số nguyên để lưu',()=>{
 assert.equal(formatVndInput('100000'),'100.000');assert.equal(formatVndInput('1200000'),'1.200.000');
 assert.equal(parseVnd('1.200.000'),'1200000');assert.ok(Number.isNaN(parseVnd('12.30a')));
});
test('định dạng giữa chuỗi vẫn giữ đúng vị trí con trỏ',()=>{
 const el={value:'123456',selectionStart:3,setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}};
 formatMoneyElement(el);assert.equal(el.value,'123.456');assert.equal(el.selectionStart,3);
});
test('form chuyển tiền được định dạng thành giá trị để tính toán',()=>{
 const fields={unitCost:'125.000',freight:'15.000',quantity:'5',phone:'0123456'};
 const form={querySelectorAll:()=>[{name:'unitCost'},{name:'freight'}]};
 normalizeMoneyFields(form,fields);assert.equal(fields.unitCost,'125000');assert.equal(fields.freight,'15000');assert.equal(fields.quantity,'5');assert.equal(fields.phone,'0123456');
});

test('người dùng gõ từng chữ số: 1000 → 1.000, 1000000 → 1.000.000',()=>{
 const el={value:'',selectionStart:0,setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}};
 for(const digit of '1000000'){el.value+=digit;el.selectionStart=el.value.length;formatMoneyElement(el);}
 assert.equal(el.value,'1.000.000');
 assert.equal(parseVnd(el.value),'1000000');
});
test('dán tiền có dấu chấm hoặc khoảng trắng vẫn về đơn vị đồng',()=>{
 const el={value:'1 234 567',selectionStart:9,setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}};
 formatMoneyElement(el);assert.equal(el.value,'1.234.567');
 assert.equal(parseVnd(el.value),'1234567');
});
