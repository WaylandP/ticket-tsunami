import test from 'node:test';
import assert from 'node:assert/strict';
import {SECURITY_CASES,createSecurityCase,inspectSecurityEvidence,respondToSecurityCase,parseSecurityProgress,recordSecurityCompletion} from '../src/security.js';

test('each defensive case has unique evidence and one supported response',()=>{
  assert.equal(new Set(SECURITY_CASES.map(c=>c.id)).size,6);
  for(const c of SECURITY_CASES){
    assert.equal(c.actions.filter(a=>a.correct).length,1,c.id);
    assert.equal(new Set(c.evidence.map(e=>e.id)).size,c.evidence.length);
    assert.ok(c.actions.every(a=>a.feedback.length>20));
    assert.ok(c.evidence.every(e=>e.detail.length>20));
  }
});
test('a response requires evidence and does not mutate the case state',()=>{
  const state=createSecurityCase('phishing'),before=structuredClone(state);
  const result=respondToSecurityCase(state,'report');
  assert.equal(result.accepted,false);assert.deepEqual(state,before);
  assert.equal(createSecurityCase('unknown'),null);
  assert.equal(inspectSecurityEvidence(state,'unknown'),state);
  assert.equal(respondToSecurityCase(state,'unknown').accepted,false);
});
test('wrong responses allow learning without awarding completion or a first-try pass',()=>{
  for(const c of SECURITY_CASES){
    let state=inspectSecurityEvidence(createSecurityCase(c.id),c.evidence[0].id);
    const before=structuredClone(state),wrong=respondToSecurityCase(state,c.actions.find(a=>!a.correct).id);
    assert.deepEqual(state,before);assert.equal(wrong.state.complete,false);
    let progress=parseSecurityProgress(null);
    assert.equal(recordSecurityCompletion(progress,wrong),progress);
    const correct=respondToSecurityCase(wrong.state,c.actions.find(a=>a.correct).id);
    assert.equal(correct.state.complete,true);assert.equal(correct.firstTry,false);
    progress=recordSecurityCompletion(progress,correct);
    assert.deepEqual(progress.completed,[c.id]);assert.deepEqual(progress.firstTry,[]);
    assert.equal(respondToSecurityCase(correct.state,c.actions[0].id).accepted,false);
  }
});
test('all six cases complete, persist and resist duplicate credit',()=>{
  let progress=parseSecurityProgress(null);
  for(const c of SECURITY_CASES){
    let state=createSecurityCase(c.id);
    for(const e of c.evidence) state=inspectSecurityEvidence(state,e.id);
    assert.equal(inspectSecurityEvidence(state,c.evidence[0].id),state);
    const result=respondToSecurityCase(state,c.actions.find(a=>a.correct).id);
    progress=recordSecurityCompletion(progress,result);
    assert.equal(recordSecurityCompletion(progress,result),progress);
  }
  assert.equal(progress.completed.length,6);assert.equal(progress.firstTry.length,6);
  assert.deepEqual(parseSecurityProgress(JSON.stringify(progress)),progress);
});
test('stored progress ignores malformed, future and unknown entries',()=>{
  const empty={version:1,completed:[],firstTry:[]};
  for(const raw of [null,'{','null','[]','{"version":2,"completed":["phishing"]}'])assert.deepEqual(parseSecurityProgress(raw),empty);
  assert.deepEqual(parseSecurityProgress('{"version":1,"completed":["usb","usb","bogus"],"firstTry":["mfa","usb","usb"]}'),{version:1,completed:['usb'],firstTry:['usb']});
});
