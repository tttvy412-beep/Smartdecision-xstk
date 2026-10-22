import test from 'node:test';import assert from 'node:assert/strict';
import {seedDemo,baseState} from '../src/core.mjs';
import {abcAnalysis,stockCover,healthScore} from '../src/insights.mjs';
import {analyzeDemand} from '../src/demand.mjs';
test('ABC classes are cumulative Pareto and sum to total',()=>{const a=abcAnalysis(seedDemo());assert.ok(a.length>=3);assert.equal(a[0].klass,'A');assert.ok(Math.abs(a.at(-1).cumulative-1)<1e-9);assert.ok(a.every((x,i)=>i===0||a[i-1].revenue>=x.revenue));});
test('stock cover is null without recent sales and ordered ascending',()=>{const s=seedDemo();const c=stockCover(s);assert.equal(c.length,s.products.length);const known=c.filter(x=>x.cover!==null).map(x=>x.cover);assert.deepEqual(known,[...known].sort((a,b)=>a-b));});
test('health score refuses to score empty data and stays in 0..100',()=>{assert.equal(healthScore(baseState()),null);const h=healthScore(seedDemo());assert.ok(h.score>=0&&h.score<=100);assert.ok(h.parts.every(p=>p.score>=0&&p.score<=100));});
test('insufficient demand history does not claim a trend',()=>{const d=analyzeDemand(seedDemo(),'SP01',10,5);if(!d.sufficient)assert.match(d.trendLabel,/Chưa đủ/);});
