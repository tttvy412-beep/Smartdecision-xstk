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

/**
 * Apply a single keyboard edit to the numeric value rather than to the visible
 * grouping dots. This avoids repeating digits when the browser repositions the
 * caret after formatting (for example 50000000 => 55555500000000).
 * Input is an integer amount of VND; it is never parsed as a decimal number.
 */
export function applyMoneyEdit(display,start,end,inputType,text=''){
  if(!['insertText','deleteContentBackward','deleteContentForward','deleteByCut'].includes(inputType))return null;
  const old=String(display??'');
  const begin=Math.max(0,Math.min(old.length,Number(start)||0));
  const stop=Math.max(begin,Math.min(old.length,Number(end)||0));
  const left=old.slice(0,begin).replace(/\D/g,'').length;
  const right=old.slice(0,stop).replace(/\D/g,'').length;
  let digits=old.replace(/\D/g,'');let at=left;let a=left,b=right;
  if(inputType==='insertText'){
    const insert=String(text??'').replace(/\D/g,'');
    if(!insert)return {value:formatVndInput(digits),caret:begin};
    digits=(digits.slice(0,a)+insert+digits.slice(b)).slice(0,15);
    at=Math.min(digits.length,a+insert.length);
  }else {
    if(a===b&&inputType==='deleteContentBackward')a=Math.max(0,a-1);
    if(a===b&&inputType==='deleteContentForward')b=Math.min(digits.length,b+1);
    digits=digits.slice(0,a)+digits.slice(b);at=a;
  }
  const formatted=formatVndInput(digits);
  let caret=0,n=0;
  if(at>0){caret=formatted.length;for(let i=0;i<formatted.length;i++){if(/\d/.test(formatted[i]))n++;if(n===at){caret=i+1;break;}}}
  return {value:formatted,caret};
}
