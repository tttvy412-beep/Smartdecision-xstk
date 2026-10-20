/** Money input is formatted for people while calculations always use integer VND. */
export function parseVnd(value){
  const raw=String(value??'').trim();
  if(!raw)return '';
  const digits=raw.replace(/[.\s₫]/g,'');
  return /^\d+$/.test(digits)?digits:NaN;
}
export function formatVndInput(value){
  const n=parseVnd(value);
  return n===''?'':Number.isNaN(n)?'':n.replace(/^0+(?=\d)/,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
/** Keep cursor at the same number of digits to the left when reformatting. */
export function formatMoneyElement(el){
  if(!el||!('value' in el))return;
  const before=el.value;
  const cursor=Number.isInteger(el.selectionStart)?el.selectionStart:before.length;
  const digitsBefore=before.slice(0,cursor).replace(/\D/g,'').length;
  const normalized=before.replace(/\D/g,'').slice(0,15);
  const formatted=formatVndInput(normalized);
  el.value=formatted;
  if(typeof el.setSelectionRange==='function'){
    let k=0,pos=formatted.length;
    if(digitsBefore===0)pos=0;
    else for(let i=0;i<formatted.length;i++)if(/\d/.test(formatted[i])&&++k===digitsBefore){pos=i+1;break;}
    el.setSelectionRange(pos,pos);
  }
}
export function normalizeMoneyFields(form,fields){
  if(typeof form?.querySelectorAll!=='function')return fields;
  for(const field of form.querySelectorAll('[data-money]')){
    if(Object.prototype.hasOwnProperty.call(fields,field.name))fields[field.name]=parseVnd(fields[field.name]);
  }
  return fields;
}
