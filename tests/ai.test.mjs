import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../netlify/functions/decision-ai.mjs';
const url='http://localhost/.netlify/functions/decision-ai';
test('Netlify AI endpoint rejects GET before accessing external API',async()=>{
 const r=await handler(new Request(url,{method:'GET'}));
 assert.equal(r.status,405);
});
test('Netlify AI endpoint rejects empty question without external API calls',async()=>{
 const oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 try{const r=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:''})}));assert.equal(r.status,400)}
 finally{if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});
test('AI returns a generated answer from the Netlify server proxy',async()=>{
 const original=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 globalThis.fetch=async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Kết quả giả lập cho kiểm thử'}]}}]}),{status:200,headers:{'content-type':'application/json'}});
 try{const r=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:'Phân tích kho'})}));assert.equal(r.status,200);assert.match((await r.json()).answer,/giả lập/)}
 finally{globalThis.fetch=original;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});
