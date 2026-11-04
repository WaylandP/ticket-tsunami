// Security work has its own lifecycle; the existing ticket engine stays pure.
import {SECURITY_CASES,createSecurityCase,inspectSecurityEvidence,respondToSecurityCase} from './security.js';
export const SECURITY_INTERVAL=60000;
export const SECURITY_REPORTERS=['Maya · Finance','Leo · Marketing','Reception · Floor 03','Endpoint protection','People Operations','Managed software center'];
export function createSecurityShift({practice=false,tutorial=false,elapsed=0}={}) {
  return {practice,enabled:!tutorial,items:tutorial?[]:[createSecurityCase(SECURITY_CASES[0].id)],nextAt:elapsed+SECURITY_INTERVAL,round:1};
}
export function advanceSecurityShift(session,{elapsed=0,round=1}={}) {
  if(!session.enabled || session.items.length===SECURITY_CASES.length || session.items.filter(i=>!i.complete).length>=2) return session;
  if(session.practice?round<=session.round:elapsed<session.nextAt) return session;
  return {...session,round,nextAt:elapsed+SECURITY_INTERVAL,items:[...session.items,createSecurityCase(SECURITY_CASES[session.items.length].id)]};
}
export function inspectShiftEvidence(session,id,evidence) {
  return {...session,items:session.items.map(i=>i.id===id?inspectSecurityEvidence(i,evidence):i)};
}
export function respondToShiftIncident(session,id,action) {
  const item=session.items.find(i=>i.id===id);
  const result=respondToSecurityCase(item,action);
  if(!result.accepted) return {session,result};
  return {session:{...session,items:session.items.map(i=>i.id===id?result.state:i)},result};
}
export function securityShiftSummary(session) {
  const resolved=session.items.filter(i=>i.complete);
  return {received:session.items.length,resolved:resolved.length,open:session.items.length-resolved.length,firstTry:resolved.filter(i=>i.attempts.length===1).length};
}
