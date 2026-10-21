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

test('Gemini stops at MAX_TOKENS: server requests continuation and combines the complete response',async()=>{
 const previousFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 let call=0,firstPayload,followPayload;
 globalThis.fetch=async(url,opts)=>{
   call++;const p=JSON.parse(opts.body);if(call===1)firstPayload=p;else followPayload=p;
   const data=call===1?
    {candidates:[{content:{parts:[{text:'Phương án 1: Đặt mua 10 áo theo mức tối thiểu.\n-'}]},finishReason:'MAX_TOKENS'}]}:
    {candidates:[{content:{parts:[{text:'Kiểm tra nhà cung cấp và chi phí vận chuyển.\nKết luận: Chọn phương án phù hợp sau khi xác minh nhu cầu.'}]},finishReason:'STOP'}]};
   return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
 };
 try{
  const response=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:'Hàng nào cần nhập?'})}));
  const payload=await response.json();
  assert.equal(response.status,200);
  assert.equal(call,2);
  assert.match(payload.answer,/Kết luận/);
  assert.match(payload.answer,/Phương án 1/);
  assert.equal(firstPayload.generationConfig.maxOutputTokens,4096);
  assert.match(followPayload.contents.at(-1).parts[0].text,/viết tiếp/);
 }finally{globalThis.fetch=previousFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});

test('Gemini cannot finish even after continuation: rejects incomplete answer instead of showing it',async()=>{
 const previousFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 globalThis.fetch=async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Phương án 1: Nhập...'}]},finishReason:'MAX_TOKENS'}]}),{status:200,headers:{'content-type':'application/json'}});
 try{
  const response=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:'Phân tích kho'})}));
  assert.equal(response.status,502);
  assert.match((await response.json()).error,/chưa hoàn tất/i);
 }finally{globalThis.fetch=previousFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});

test('Gemini long valid response is not silently cut at 6500 characters',async()=>{
 const previousFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 const text='Số liệu đã xác minh. '.repeat(380);
 globalThis.fetch=async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text}]},finishReason:'STOP'}]}),{status:200,headers:{'content-type':'application/json'}});
 try{
  const response=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:'Phân tích kho'})}));
  assert.equal(response.status,200);
  assert.equal((await response.json()).answer,text.trim());
 }finally{globalThis.fetch=previousFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});

test('AI response ending in a broken bullet is continued even if finishReason is STOP',async()=>{
 const previousFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';
 let calls=0;
 globalThis.fetch=async()=>{
   calls++;
   const text=calls===1?'Phương án 1: Nhập bù theo định mức\n-':'Kiểm tra số lượng thiếu và ngân sách.\nKết luận: Ưu tiên mặt hàng thiếu nhiều nhất.';
   return new Response(JSON.stringify({candidates:[{content:{parts:[{text}]},finishReason:'STOP'}]}),{status:200,headers:{'content-type':'application/json'}});
 };
 try{
  const response=await handler(new Request(url,{method:'POST',headers:{'x-nf-client-connection-ip':'mock-final'},body:JSON.stringify({question:'Cần nhập hàng nào?'})}));
  assert.equal(response.status,200);assert.equal(calls,2);
  assert.match((await response.json()).answer,/Kết luận/);
 }finally{globalThis.fetch=previousFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey}
});

test('Production Supabase configuration rejects unauthenticated AI requests',async()=>{
 const oldKey=process.env.GEMINI_API_KEY,oldUrl=process.env.SUPABASE_URL,oldPub=process.env.SUPABASE_PUBLISHABLE_KEY;
 process.env.GEMINI_API_KEY='test-server-only-key';process.env.SUPABASE_URL='https://test-auth-project.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_test_value_012345';
 try{
  const r=await handler(new Request(url,{method:'POST',body:JSON.stringify({question:'Phân tích tồn kho'})}));
  assert.equal(r.status,401);assert.match((await r.json()).error,/đăng nhập/i);
 }finally{
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
  if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;
  if(oldPub===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;else process.env.SUPABASE_PUBLISHABLE_KEY=oldPub;
 }
});
test('Production AI validates Supabase token before calling Gemini',async()=>{
 const oldKey=process.env.GEMINI_API_KEY,oldUrl=process.env.SUPABASE_URL,oldPub=process.env.SUPABASE_PUBLISHABLE_KEY,original=globalThis.fetch;
 process.env.GEMINI_API_KEY='test-server-only-key';process.env.SUPABASE_URL='https://test-auth-project.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_test_value_012345';
 let authCalls=0,geminiCalls=0;
 globalThis.fetch=async (endpoint,options)=>{
  if(String(endpoint).includes('/auth/v1/user')){authCalls++;assert.equal(options.headers.Authorization,'Bearer validtoken');return new Response(JSON.stringify({id:'user-123'}),{status:200});}
  geminiCalls++;return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Phân tích có xác thực.'}]},finishReason:'STOP'}]}),{status:200});
 };
 try{
  const r=await handler(new Request(url,{method:'POST',headers:{Authorization:'Bearer validtoken'},body:JSON.stringify({question:'Phân tích tồn kho'})}));
  assert.equal(r.status,200);assert.equal(authCalls,1);assert.equal(geminiCalls,1);
 }finally{
  globalThis.fetch=original;
  if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;
  if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;
  if(oldPub===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;else process.env.SUPABASE_PUBLISHABLE_KEY=oldPub;
 }
});
