import test from 'node:test'
import assert from 'node:assert/strict'
import {calculate,dse} from './scoring.js'
const base={words:520,typos:2,content:9,expression:8,structure:7,writing:8,offTopic:false}
test('字数封顶只影响内容；多个上限取严格值',()=>{let r=calculate(base);assert.equal(r.dimensions[0].score,28);assert.equal(r.total,76);r=calculate({...base,offTopic:true});assert.equal(r.dimensions[0].score,12);assert.equal(r.dimensions[1].score,21)})
test('字数临界与未确认300字阻断',()=>{for(const [words,cap] of [[299,3],[301,5],[449,5],[450,7],[549,7],[550,10],[649,10],[650,10]])assert.equal(calculate({...base,words}).dimensions[0].cap,cap);assert.equal(calculate({...base,words:300}).pending.length,1)})
test('错字分档和无效输入',()=>{for(const [typos,score] of [[0,3],[1,3],[2,2],[4,2],[5,1],[7,1],[8,0]])assert.equal(calculate({...base,typos}).typoScore,score);assert.ok(calculate({...base,words:-1}).pending.length);assert.ok(calculate({...base,content:11}).pending.length)})
test('校本方案不继承DSE规则',()=>{const rule={...dse,caps:false,typoMax:0};const r=calculate({...base,words:300,offTopic:true},rule);assert.equal(r.dimensions[0].score,36);assert.equal(r.max,100);assert.equal(r.pending.length,0)})
