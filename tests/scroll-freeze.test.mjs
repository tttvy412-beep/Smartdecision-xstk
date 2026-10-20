import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(resolve(here,'../src/app.mjs'),'utf8');
const css=readFileSync(resolve(here,'../styles.css'),'utf8');

test('focused number fields release wheel without preventDefault, so scrolling is not frozen',()=>{
 const start=app.indexOf("document.addEventListener('wheel'");
 assert.ok(start>=0);
 const stop=app.indexOf('let dragging=',start);
 const handler=app.slice(start,stop);
 assert.match(handler,/field\.blur\(\)/);
 assert.doesNotMatch(handler,/preventDefault/);
 assert.match(handler,/passive:true/);
});
test('end of sidebar and table scroll allows natural page scrolling',()=>{
 assert.match(css,/\.sidebar\{overscroll-behavior-y:auto\}/);
 assert.match(css,/\.table-scroll\{overscroll-behavior:auto\}/);
});
test('modal and chat remain contained during independent scrolling',()=>{
 assert.match(css,/\.modal,\.chat-body\{overscroll-behavior:contain\}/);
});
