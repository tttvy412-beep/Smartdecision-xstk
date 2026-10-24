/**
 * Explainable demand analysis; never call a sparse historical run-rate an AI prediction.
 * Uses only completed orders with dated SKU lines, compared in three 30-day windows.
 */
export function analyzeDemand(state,productId,stock=0,min=0,now=new Date()){
 const orders=Array.isArray(state?.orders)?state.orders:[];
 const anchor=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
 const windows=[0,0,0];let sampleOrders=0;const dates=new Set();
 for(const o of orders){
  if(o.status!=='Hoàn thành'||!/^\d{4}-\d\d-\d\d/.test(String(o.date||''))||!Array.isArray(o.lines))continue;
  const date=Date.parse(String(o.date).slice(0,10)+'T00:00:00Z');
  const days=Math.floor((anchor-date)/86400000);
  if(!Number.isFinite(days)||days<0||days>=90)continue;
  const quantity=o.lines.filter(l=>l.productId===productId).reduce((sum,l)=>sum+Math.max(0,Number(l.quantity)||0),0);
  if(!quantity)continue;
  windows[2-Math.floor(days/30)]+=quantity;
  sampleOrders++;dates.add(String(o.date).slice(0,10));
 }
 const [older,middle,recent]=windows;
 const periods=windows.filter(n=>n>0).length;
 const sufficient=sampleOrders>=5&&periods>=2&&dates.size>=4;
 const previous=middle||older;
 const trend=(previous>0)?(recent-previous)/previous:null;
 const trendLabel=(trend===null||!sufficient)?'Chưa đủ dữ liệu đối chiếu':trend>0.15?'Lượng bán có xu hướng tăng':trend<-.15?'Lượng bán có xu hướng giảm':'Lượng bán tương đối ổn định';
 // Weighted run-rate: clearly a scenario based on sales, not a claimed AI forecast.
 const raw=older*.2+middle*.3+recent*.5;
 const projected=sufficient?Math.max(0,Math.round(raw)):null;
 const variation=Math.max(...windows)-Math.min(...windows);
 const confidence=sampleOrders>=12&&periods===3&&variation<=Math.max(3,raw*.6)?'Trung bình (có thể kiểm chứng thêm)':'Thấp (chưa đủ dữ liệu ổn định)';
 const caution=sampleOrders===0?'Không tìm thấy đơn hoàn thành có SKU trong 90 ngày.':sampleOrders<5?'Có quá ít đơn hàng phù hợp để dự báo nhu cầu.':periods<2?'Lượng bán chỉ tập trung trong một giai đoạn, chưa đủ căn cứ xác định xu hướng.':dates.size<4?'Giao dịch tập trung vào quá ít ngày; chưa đủ mẫu độc lập.':'Mô hình dùng trọng số 20% / 30% / 50% cho các kỳ 30 ngày từ cũ đến mới';
 return {windows,last30:recent,sampleOrders,distinctDays:dates.size,sufficient,projected,reorder:sufficient?Math.max(0,projected+Math.max(0,Number(min)||0)-Math.max(0,Number(stock)||0)):null,trendLabel,confidence,explanation:caution,method:'Bình quân bán theo ba kỳ 30 ngày có trọng số và đánh giá mức đủ dữ liệu'};
}
