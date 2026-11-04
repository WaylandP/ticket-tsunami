// Standalone defensive training. This module never imports or mutates the shift engine.
export const SECURITY_CASES = [
  {
    id:'phishing', title:'The urgent password email', topic:'Phishing', kind:'mail', duration:'2 min',
    intro:'A coworker forwards a message saying their account will close in ten minutes. They have not opened its link.',
    artifact:{ eyebrow:'FORWARDED EMAIL', title:'Your account expires today', from:'IT Support <help@account-review.example>', body:'Keep your access. Confirm your work password before 10:00 AM.', detail:'Button label: Keep my account' },
    evidence:[
      {id:'sender', label:'Inspect sender', title:'A familiar name is not an identity', detail:'The display name says IT Support, but the sender is account-review.example. Your organization uses work.example. Display names can be copied.'},
      {id:'link', label:'Inspect destination', title:'The destination does not match', detail:'The button points to hxxps://work-login.example/verify. This is a fictional training address, shown without opening it. It is not the known work.example portal.'},
      {id:'request', label:'Read the request', title:'Urgency plus a credential request', detail:'The message pressures the coworker to enter a password through its link. A countdown and polished branding do not establish trust.'},
    ],
    actions:[
      {id:'reply', label:'Reply and ask whether it is real', feedback:'Replying asks the same unverified sender to vouch for the message. Use a known internal channel instead.'},
      {id:'report', label:'Report it through the approved phishing channel', correct:true, feedback:'Keep the link unopened and submit the message using the organization’s reporting process. Verify any account concern through the known portal or internal help desk.'},
      {id:'open', label:'Open the link to check the page', feedback:'Opening an untrusted destination is unnecessary. Inspect the address without following it, then report through a trusted channel.'},
    ], takeaway:'Check the sender, destination and request together. Report before interacting.',
  },
  {
    id:'mfa', title:'The prompts will not stop', topic:'MFA fatigue', kind:'phone', duration:'2 min',
    intro:'A coworker receives seven sign-in approval requests during lunch. They are not trying to sign in.',
    artifact:{eyebrow:'AUTHENTICATOR',title:'Approve this sign-in?',from:'7 requests in 3 minutes',body:'New browser · account access requested',detail:'Coworker: “I did not start this.”'},
    evidence:[
      {id:'intent',label:'Ask the coworker',title:'No matching sign-in attempt',detail:'The coworker confirms they did not initiate any of these requests. An unsolicited approval must not be accepted.'},
      {id:'pattern',label:'Review the pattern',title:'Repeated requests can be deliberate',detail:'Attackers may send many prompts hoping someone approves one to stop the interruptions. A plausible location alone does not prove a request is safe.'},
      {id:'channel',label:'Check the response route',title:'A known security contact is available',detail:'The internal directory lists the security response channel. Do not use contact details supplied by a caller asking you to approve a prompt.'},
    ],
    actions:[
      {id:'approve',label:'Approve one to stop the notifications',feedback:'One approval may be enough to grant access. Never approve a sign-in you did not initiate.'},
      {id:'disable',label:'Turn off MFA for the account',feedback:'Removing MFA weakens the account while an attack may be underway. Security can investigate and manage recovery through its approved process.'},
      {id:'deny',label:'Deny the requests and alert security',correct:true,feedback:'Reject the unsolicited prompts and report them through the known security channel. Follow the team’s account-recovery and session-review process if compromise is suspected.'},
    ], takeaway:'Only approve authentication you initiated. Phishing-resistant MFA is a stronger long-term control.',
  },
  {
    id:'usb', title:'A free drive in the lobby', topic:'Removable media', kind:'usb', duration:'2 min',
    intro:'Someone brings in a flash drive labeled “Payroll.” It was found beside the building elevators and has not been connected.',
    artifact:{eyebrow:'FOUND DEVICE',title:'PAYROLL',from:'Owner unknown',body:'Found beside the elevators · never connected',detail:'A label is not a trust signal.'},
    evidence:[
      {id:'origin',label:'Check its origin',title:'No verified owner',detail:'The drive was found in a shared public area. Its contents and behavior are unknown, regardless of the label.'},
      {id:'policy',label:'Read the media policy',title:'Unknown media goes to security',detail:'The fictional office policy says to keep found media disconnected and hand it to the security team. Only authorized specialists may examine it under their procedure.'},
      {id:'risk',label:'Consider the device',title:'Risk starts before opening a file',detail:'A USB device can behave as more than a storage drive. Connecting it to a work computer, a spare laptop or a personal device is not a safe inspection method.'},
    ],
    actions:[
      {id:'handoff',label:'Keep it unplugged and hand it to security',correct:true,feedback:'Record where it was found and use the established handoff process. The security team decides whether and how to examine unknown media.'},
      {id:'spare',label:'Try it on an old spare laptop',feedback:'A spare computer is still a computer that can be affected. Do not improvise a testing environment for unknown media.'},
      {id:'scan',label:'Plug it in and run a quick scan',feedback:'Connecting an unknown device can create risk before a scan runs. Follow the media-handling policy instead.'},
    ], takeaway:'Found USB devices stay disconnected. Curiosity is not a security control.',
  },
  {
    id:'ransomware', title:'Files are changing names', topic:'Incident response', kind:'endpoint', duration:'3 min',
    intro:'Endpoint protection reports active file encryption on one workstation. You are authorized to isolate it, and the containment control is available.',
    artifact:{eyebrow:'ENDPOINT ALERT',title:'Encryption activity detected',from:'WORKSTATION 042 · high severity',body:'Multiple files renamed · outbound network traffic active',detail:'Approved isolation control: available'},
    evidence:[
      {id:'alert',label:'Review the alert',title:'A potential active incident',detail:'The managed endpoint console reports rapid file modifications and suspicious activity. Treat this as an incident; a routine restart is not the first response.'},
      {id:'runbook',label:'Read the runbook',title:'Contain first, coordinate the response',detail:'The office runbook authorizes network isolation for this alert. Keep the system powered when isolation is possible, notify the response team via a known out-of-band channel, and preserve evidence.'},
      {id:'scope',label:'Check what is known',title:'One alert does not prove only one affected host',detail:'Record the device, time and observed alert. Security must assess scope, accounts and other hosts. Do not reconnect the workstation just because the alert stops.'},
    ],
    actions:[
      {id:'restart',label:'Restart it and see whether the files recover',feedback:'Restarting can destroy useful volatile evidence and does not establish that the incident is contained. The approved isolation control is available.'},
      {id:'isolate',label:'Isolate the endpoint and notify incident response',correct:true,feedback:'Use the authorized network-isolation control, keep the device powered, and contact the response team through a trusted alternate channel. Preserve the alert and timeline; let the team direct recovery.'},
      {id:'wipe',label:'Wipe the device immediately',feedback:'An uncoordinated wipe can destroy evidence and leave the wider incident unresolved. Contain and escalate before recovery.'},
    ], takeaway:'Contain, escalate and preserve evidence. Recovery follows the incident-response plan.',
  },
  {
    id:'sharing', title:'The link went outside', topic:'Data protection', kind:'share', duration:'2 min',
    intro:'A confidential staffing file was shared using an “anyone with the link” setting. You own the file and can restrict access immediately.',
    artifact:{eyebrow:'SHARING REVIEW',title:'Staffing plan · confidential',from:'Current access: anyone with the link',body:'Link sent to an external address',detail:'File owner controls: available'},
    evidence:[
      {id:'access',label:'Inspect permissions',title:'Access is broader than intended',detail:'The file is labeled confidential. A public link lets people beyond the intended recipients open it. Restricting that link is an available containment action.'},
      {id:'activity',label:'Review activity',title:'Do not assume who viewed it',detail:'The available activity view is incomplete. Preserve the record and share the facts with the response team rather than assuming nobody accessed the file.'},
      {id:'process',label:'Check the reporting process',title:'Contain and report the exposure',detail:'The office process requires restricting unauthorized access, retaining the activity record, and notifying security. The response team assesses scope and any notification obligations.'},
    ],
    actions:[
      {id:'ask',label:'Ask the recipient to ignore it and close the ticket',feedback:'That leaves the public link active and does not establish whether information was accessed. Containment and reporting are still needed.'},
      {id:'delete',label:'Delete the file and its activity record',feedback:'Deleting the evidence makes assessment harder and may not remove copies already accessed. Restrict the unauthorized sharing and preserve the record.'},
      {id:'restrict',label:'Restrict the link, preserve activity and report',correct:true,feedback:'Remove the broad access you control, retain the available record, and report the exposure through the internal process. Security can determine scope and next steps.'},
    ], takeaway:'Reduce exposure promptly and preserve the facts. Do not quietly close a potential data incident.',
  },
  {
    id:'updates', title:'An update you can verify', topic:'Secure maintenance', kind:'update', duration:'2 min',
    intro:'A coworker asks whether an update is legitimate. The managed software center lists it, the device matches its target, and the maintenance window is approved.',
    artifact:{eyebrow:'MANAGED SOFTWARE CENTER',title:'Security maintenance ready',from:'Approved package · device eligible',body:'Backup complete · restart scheduled',detail:'No email attachment or pop-up download'},
    evidence:[
      {id:'source',label:'Verify the source',title:'Opened through a known route',detail:'The coworker opened the organization’s managed software center directly. Its approved catalog contains this exact package. This is not a download linked from an unsolicited message.'},
      {id:'approval',label:'Check the change record',title:'Approval and safeguards are in place',detail:'The change record matches the device and package. Backup, rollback and the maintenance window are confirmed; the coworker has saved their work.'},
      {id:'benefit',label:'Read the security note',title:'Updates reduce known exposure',detail:'The approved release addresses a known security weakness. The evidence supports installing it through the managed channel, rather than delaying it indefinitely.'},
    ],
    actions:[
      {id:'install',label:'Install through the approved managed channel',correct:true,feedback:'Use the verified managed package in the approved window, follow its restart instructions, and confirm the endpoint reports the expected version afterward.'},
      {id:'delay',label:'Postpone every update to avoid change',feedback:'Indefinite delay leaves known security weaknesses exposed. This package, device and maintenance window have been verified.'},
      {id:'search',label:'Find a faster installer on the web',feedback:'An unrelated download bypasses the verified source and approved process. Use the package already available in the managed catalog.'},
    ], takeaway:'Good triage also recognizes legitimate work. Verify the source, approval and result.',
  },
];
export const SECURITY_STORAGE_KEY='ticket-tsunami:security:v1';
export function createSecurityCase(id) {
  if(!SECURITY_CASES.some(c=>c.id===id)) return null;
  return {id,inspected:[],attempts:[],complete:false};
}
export function inspectSecurityEvidence(state,id) {
  const entry=SECURITY_CASES.find(c=>c.id===state?.id);
  if(!entry?.evidence.some(e=>e.id===id) || state.inspected.includes(id)) return state;
  return {...state,inspected:[...state.inspected,id]};
}
export function respondToSecurityCase(state,actionId) {
  const entry=SECURITY_CASES.find(c=>c.id===state?.id), action=entry?.actions.find(a=>a.id===actionId);
  if(!action || state.complete || !state.inspected.length) return {state,accepted:false};
  const next={...state,attempts:[...state.attempts,actionId],complete:!!action.correct};
  return {state:next,accepted:true,correct:!!action.correct,feedback:action.feedback,firstTry:!!action.correct && next.attempts.length===1};
}
export function parseSecurityProgress(raw) {
  try {
    const value=JSON.parse(raw);
    if(!value || value.version!==1 || !Array.isArray(value.completed)) return {version:1,completed:[],firstTry:[]};
    const completed=[...new Set(value.completed.filter(id=>SECURITY_CASES.some(c=>c.id===id)))];
    const firstTry=Array.isArray(value.firstTry)?[...new Set(value.firstTry.filter(id=>completed.includes(id)))]:[];
    return {version:1,completed,firstTry};
  } catch {return {version:1,completed:[],firstTry:[]};}
}
export function recordSecurityCompletion(progress,result) {
  if(!result.accepted || !result.correct || !result.state.complete || progress.completed.includes(result.state.id)) return progress;
  return {version:1,completed:[...progress.completed,result.state.id],firstTry:result.firstTry?[...progress.firstTry,result.state.id]:[...progress.firstTry]};
}
