import test from 'node:test';
import assert from 'node:assert/strict';
import {SECURITY_CASES} from '../src/security.js';
import {createSecurityShift,advanceSecurityShift,inspectShiftEvidence,respondToShiftIncident,securityShiftSummary,SECURITY_INTERVAL} from '../src/security-shift.js';

function resolve(session,id) {
  const c=SECURITY_CASES.find(c=>c.id===id);
  session=inspectShiftEvidence(session,id,c.evidence[0].id);
  return respondToShiftIncident(session,id,c.actions.find(a=>a.correct).id).session;
}

test('security starts with a visible incident but leaves the guided tutorial alone',()=>{
  assert.deepEqual(securityShiftSummary(createSecurityShift()),{received:1,resolved:0,open:1,firstTry:0});
  const tutorial=createSecurityShift({tutorial:true});
  assert.equal(advanceSecurityShift(tutorial,{elapsed:999999}),tutorial);
  assert.equal(tutorial.items.length,0);
});

test('timed arrivals follow elapsed shift time and cap pending work at two',()=>{
  const start=createSecurityShift(),before=structuredClone(start);
  assert.equal(advanceSecurityShift(start,{elapsed:SECURITY_INTERVAL-1}),start);
  let session=advanceSecurityShift(start,{elapsed:SECURITY_INTERVAL});
  assert.deepEqual(start,before);
  assert.deepEqual(session.items.map(i=>i.id),['phishing','mfa']);
  assert.equal(advanceSecurityShift(session,{elapsed:SECURITY_INTERVAL*10}),session);
  session=resolve(session,'phishing');
  session=advanceSecurityShift(session,{elapsed:SECURITY_INTERVAL*10});
  assert.equal(securityShiftSummary(session).open,2);
  assert.equal(session.items[2].id,'usb');
  assert.equal(session.nextAt,SECURITY_INTERVAL*11);
});

test('practice advances incidents only with a new round, not elapsed time',()=>{
  const first=createSecurityShift({practice:true});
  assert.equal(advanceSecurityShift(first,{elapsed:999999,round:1}),first);
  const completed=resolve(first,'phishing');
  assert.equal(advanceSecurityShift(completed,{elapsed:999999,round:1}),completed);
  const next=advanceSecurityShift(completed,{round:2});
  assert.equal(next.items[1].id,'mfa');
  assert.equal(advanceSecurityShift(next,{round:2}),next);
});

test('an overtime start schedules the second incident relative to the new shift',()=>{
  const elapsed=160000,session=createSecurityShift({elapsed});
  assert.equal(advanceSecurityShift(session,{elapsed}),session);
  assert.equal(advanceSecurityShift(session,{elapsed:elapsed+SECURITY_INTERVAL-1}),session);
  assert.equal(advanceSecurityShift(session,{elapsed:elapsed+SECURITY_INTERVAL}).items.length,2);
});

test('evidence and retries belong to their incident and do not alter earlier state',()=>{
  const first=advanceSecurityShift(createSecurityShift(),{elapsed:SECURITY_INTERVAL});
  assert.equal(respondToShiftIncident(first,'phishing','report').session,first);
  assert.equal(respondToShiftIncident(first,'unknown','report').session,first);
  const inspected=inspectShiftEvidence(first,'phishing','link');
  const retry=respondToShiftIncident(inspected,'phishing','reply').session;
  assert.deepEqual(first.items[0].inspected,[]);
  assert.deepEqual(retry.items[0].inspected,['link']);
  assert.deepEqual(retry.items[0].attempts,['reply']);
  assert.deepEqual(retry.items[1],first.items[1]);
  const done=respondToShiftIncident(retry,'phishing','report').session;
  assert.deepEqual(securityShiftSummary(done),{received:2,resolved:1,open:1,firstTry:0});
  assert.equal(respondToShiftIncident(done,'phishing','report').session,done);
});

test('all six incidents resolve once per shift and new shifts start fresh',()=>{
  let session=createSecurityShift({practice:true});
  for(let i=0;i<SECURITY_CASES.length;i++) {
    session=advanceSecurityShift(session,{round:i+1});
    assert.equal(session.items.at(-1).id,SECURITY_CASES[i].id);
    session=resolve(session,SECURITY_CASES[i].id);
  }
  assert.deepEqual(securityShiftSummary(session),{received:6,resolved:6,open:0,firstTry:6});
  assert.equal(advanceSecurityShift(session,{round:100}),session);
  assert.deepEqual(securityShiftSummary(createSecurityShift({practice:true})),{received:1,resolved:0,open:1,firstTry:0});
});
