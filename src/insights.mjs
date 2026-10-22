// RetailMind DSS insights — pure, explainable calculations from recorded data only.
import {financials,salesByProduct,customerReceivables,supplierDeliveryStats,isoDay} from './core.mjs';

// ABC (Pareto) classification by completed-sales revenue: A = first 80%, B = next 15%, C = remainder.
export function abcAnalysis(state){
 const rows=salesByProduct(state).filter(x=>x.revenue>0).sort((a,b)=>b.revenue-a.revenue);
 const total=rows.reduce((t,x)=>t+x.revenue,0);
 let run=0;
 return rows.map(x=>{const before=total?run/total:0;run+=x.revenue;const share=total?x.revenue/total:0;
  return {...x,share,cumulative:total?run/total:0,klass:before<0.8?'A':before<0.95?'B':'C'};});
}

// Days of stock cover from the last `days` days of completed sales (null when no sales to project).
export function stockCover(state,now=new Date(),days=30){
 const end=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
 const sold=new Map();
 for(const o of state.orders||[]){
  if(o.status!=='Hoàn thành'||!Array.isArray(o.lines)||!/^\d{4}-\d\d-\d\d/.test(String(o.date||'')))continue;
  const age=Math.floor((end-Date.parse(String(o.date).slice(0,10)+'T00:00:00Z'))/86400000);
  if(!(age>=0&&age<days))continue;
  for(const l of o.lines)sold.set(l.productId,(sold.get(l.productId)||0)+Math.max(0,Number(l.quantity)||0));
 }
 return state.products.filter(p=>p.active!==false).map(p=>{
  const units=sold.get(p.id)||0,daily=units/days,cover=daily>0?Math.round(p.stock/daily):null;
  const status=cover===null?(p.stock>0?'Không có bán ra':'Hết hàng'):cover<=7?'Sắp hết':cover>90?'Tồn dư':'Hợp lý';
  return {productId:p.id,name:p.name,stock:p.stock,units,daily,cover,status};
 }).sort((a,b)=>(a.cover??Infinity)-(b.cover??Infinity));
}

// Business health score 0–100 from five measurable components. Missing data lowers confidence, never invents a value.
export function healthScore(state,now=new Date()){
 const parts=[];
 const active=state.products.filter(p=>p.active!==false);
 if(active.length){const ok=active.filter(p=>p.stock>p.min).length;
  parts.push({key:'stock',label:'Tồn kho an toàn',weight:25,score:ok/active.length*100,detail:`${ok}/${active.length} SKU trên ngưỡng cảnh báo`});}
 const f=financials(state);
 if(f.orders>0){
  const known=f.verifiedRevenue;
  parts.push({key:'data',label:'Chất lượng dữ liệu giá vốn',weight:15,score:f.revenue?Math.min(100,known/f.revenue*100):100,detail:`${f.missing.length} đơn thiếu giá vốn`});
  if(known>0){const margin=f.knownGross/known;
   parts.push({key:'margin',label:'Biên lợi nhuận gộp',weight:25,score:Math.max(0,Math.min(100,margin/0.4*100)),detail:`${(margin*100).toFixed(1)}% (mốc tối ưu 40%)`});
   const covers=known?Math.max(0,Math.min(1,(f.knownGross-f.expenses)/known)):0;
   parts.push({key:'net',label:'Lợi nhuận sau chi phí',weight:20,score:f.knownAfterCosts>=0?Math.min(100,50+covers/0.15*50):Math.max(0,50+f.knownAfterCosts/known*200),detail:`${(f.knownAfterCosts/known*100).toFixed(1)}% doanh thu đã xác minh`});}
  const recv=customerReceivables(state);
  parts.push({key:'recv',label:'Thu hồi công nợ khách',weight:10,score:Math.max(0,100-recv/Math.max(1,f.revenue)*100),detail:`Phải thu ${Math.round(recv).toLocaleString('vi-VN')} ₫`});
 }
 const stats=state.suppliers.map(s=>supplierDeliveryStats(state,s.id)).filter(x=>x.sample>0);
 if(stats.length){const n=stats.reduce((t,x)=>t+x.sample,0),on=stats.reduce((t,x)=>t+x.onTime,0);
  parts.push({key:'delivery',label:'Giao hàng đúng hẹn',weight:10,score:on/n*100,detail:`${on}/${n} phiếu đúng hẹn`});}
 const w=parts.reduce((t,p)=>t+p.weight,0);
 if(!w||parts.length<2)return null;
 const score=Math.round(parts.reduce((t,p)=>t+p.score*p.weight,0)/w);
 return {score,level:score>=75?'Tốt':score>=50?'Cần theo dõi':'Cần can thiệp',tone:score>=75?'ok':score>=50?'warn':'bad',parts,coverage:w,asOf:isoDay(now)};
}
