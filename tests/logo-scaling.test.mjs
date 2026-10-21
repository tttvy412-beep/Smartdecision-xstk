import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../styles.css', import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.mjs', import.meta.url),'utf8');
test('company logo is constrained within brand container',()=>{
 assert.match(css,/\.brand-mark\s*\{[^}]*overflow:\s*hidden/s);
 assert.match(css,/\.brand-mark \.company-logo\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;/s);
 assert.match(css,/\.brand-mark \.company-logo\s*\{[^}]*object-fit:\s*contain/s);
});
test('uploaded logo can be cleared without re-uploading a file',()=>{
 assert.match(app,/data-action=\"remove-company-logo\"/);
 assert.match(app,/case 'remove-company-logo':/);
 assert.match(app,/next\.company\.logo=''/);
});
