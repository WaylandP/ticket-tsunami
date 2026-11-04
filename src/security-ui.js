import {SECURITY_CASES,SECURITY_STORAGE_KEY,parseSecurityProgress,recordSecurityCompletion} from './security.js';
import {securityIcon,securityArtifactSVG,avatar} from './icons.js';
import {createSecurityShift,advanceSecurityShift,inspectShiftEvidence,respondToShiftIncident,securityShiftSummary,SECURITY_REPORTERS} from './security-shift.js';

export function initSecurityDesk({onPause=()=>{},onResolved=()=>{},onArrival=()=>{}}={}) {
  const dialog=document.getElementById('security-dialog'), content=document.getElementById('security-content');
  let progress;
  try {progress=parseSecurityProgress(localStorage.getItem(SECURITY_STORAGE_KEY));} catch {progress=parseSecurityProgress(null);}
  let state=null,selected=null,feedback=null,returnFocus=null,session=null,feedKey='';
  const feed=document.getElementById('security-feed');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button=(label,action,cls='btn btn-ghost')=>`<button type="button" class="${cls}" data-security-action="${action}">${label}</button>`;
  const firstDecisions=n=>`${n} safe first decision${n===1?'':'s'}`;
  function save() {try {localStorage.setItem(SECURITY_STORAGE_KEY,JSON.stringify(progress));} catch {/* Browser-local progress is optional. */}}
  function updateProgress() {
    const totals=securityShiftSummary(session);
    document.getElementById('security-progress').textContent=`${totals.open} open · ${totals.resolved} resolved`;
    document.getElementById('security-progress-fill').style.width=`${totals.resolved/Math.max(1,totals.received)*100}%`;
  }
  function renderFeed() {
    if(!session?.enabled){feed.hidden=true;return;}
    feed.hidden=false;
    const totals=securityShiftSummary(session),key=JSON.stringify([totals,session.items.map(i=>i.inspected.length)]);
    if(key===feedKey)return;feedKey=key;
    const active=session.items.find(i=>!i.complete),c=SECURITY_CASES.find(c=>c.id===active?.id),index=SECURITY_CASES.indexOf(c);
    feed.innerHTML=`<button type="button" id="security-inbox" class="security-feed-heading" data-security-inbox>${securityIcon()}<strong>SECURITY DESK</strong><span class="security-live-count">${totals.open?totals.open+' OPEN':'ALL CLEAR'}</span><span class="security-resolved-count">${totals.resolved} resolved</span><span aria-hidden="true">↗</span></button>
      ${c?`<button type="button" class="security-incident-card" data-incident="${c.id}"><span class="security-reporter">${avatar(SECURITY_REPORTERS[index])}</span><span class="security-incident-copy"><span class="security-incident-meta">${escape(SECURITY_REPORTERS[index])} <span>${escape(c.topic)}</span></span><strong>${escape(c.title)}</strong><span class="security-incident-cta">${active.inspected.length?'Continue investigation':'Inspect evidence'} →${totals.open>1?' · +1 waiting':''}</span></span></button>`:`<div class="security-clear">${securityIcon()}<span><strong>${totals.received===SECURITY_CASES.length?'All six incidents resolved.':'Office protected. Nice work.'}</strong><span>${totals.received===SECURITY_CASES.length?'Review your responses in the security desk.':session.practice?'Your next round brings a new incident.':'Monitoring for the next report…'}</span></span></div>`}`;
  }
  function overview(restoreFocus=false) {
    const focusInside=content.contains(document.activeElement);
    const focusedCase=restoreFocus?document.activeElement?.dataset.securityCase:null;
    const scroll=dialog.scrollTop;
    state=null;selected=null;feedback=null;updateProgress();
    const totals=securityShiftSummary(session);
    content.innerHTML=`<section class="security-intro"><div><p class="eyebrow">YOUR SHIFT / SECURITY OPERATIONS</p><h2 tabindex="-1" id="security-screen-title">${totals.open?'Your coworkers need a second opinion.':'The office is in good hands.'}</h2><p>${totals.open?'Investigate incoming reports, verify the evidence and choose the next safe action. Your repair work is waiting at the desk.':'Your resolved incidents stay here for review. New reports arrive as your shift progresses.'}</p><span class="security-training-note">${totals.resolved} resolved · ${firstDecisions(totals.firstTry)} · ${totals.open} awaiting response</span></div><div class="security-hero-art">${securityArtifactSVG()}</div></section>
      <div class="security-case-grid">${session.items.map((item,i)=>{const c=SECURITY_CASES.find(c=>c.id===item.id);return `<button type="button" class="security-case-card${item.complete?' is-complete':''}" data-security-case="${c.id}"><span class="security-card-top"><span class="security-topic-icon">${securityIcon(c.kind)}</span><span class="security-case-index">${item.complete?'✓ RESOLVED':'● OPEN'}</span></span><strong>${escape(c.title)}</strong><span>${escape(SECURITY_REPORTERS[SECURITY_CASES.indexOf(c)])}</span><span class="security-card-go">${item.complete?'Review response':item.inspected.length?'Continue investigation':'Investigate'} <span aria-hidden="true">↗</span></span></button>`;}).join('')}</div>
      <p class="security-footnote">Fictional incidents. In real work, follow your organization’s response plan.</p>`;
    if(restoreFocus){dialog.scrollTop=scroll;if(focusInside)(content.querySelector(`[data-security-case="${focusedCase}"]`)||content.querySelector('h2')).focus({preventScroll:true});}
    else {dialog.scrollTop=0;content.querySelector('h2').focus({preventScroll:true});}
  }
  function openIncident(id) {
    state=session.items.find(i=>i.id===id);if(!state)return;
    selected=state.inspected.at(-1)||null;
    const c=SECURITY_CASES.find(c=>c.id===id),last=c.actions.find(a=>a.id===state.attempts.at(-1));
    feedback=last?{correct:!!last.correct,feedback:last.feedback}:null;
    renderCase();
  }
  function renderCase(focus='title') {
    const c=SECURITY_CASES.find(c=>c.id===state.id), evidence=c.evidence.find(e=>e.id===selected),index=SECURITY_CASES.indexOf(c);
    updateProgress();
    content.innerHTML=`<div class="security-case-heading">${button('← Incident queue','overview','btn-link')}<span class="security-case-index">${escape(SECURITY_REPORTERS[index])} / ${escape(c.topic).toUpperCase()}</span></div>
      <h2 tabindex="-1" id="security-screen-title">${escape(c.title)}</h2><p class="security-scenario">${escape(c.intro)}</p>
      <div class="security-workspace"><section class="security-artifact" aria-label="Scenario evidence"><div class="security-artifact-top"><span class="security-topic-icon">${securityIcon(c.kind)}</span><span>${escape(c.artifact.eyebrow)}</span><span class="security-sim-tag">SIMULATION</span></div><div class="security-object">${securityArtifactSVG(c.kind)}</div><div class="security-artifact-copy"><h3>${escape(c.artifact.title)}</h3><p class="security-artifact-from">${escape(c.artifact.from)}</p><p>${escape(c.artifact.body)}</p><p class="security-artifact-detail">${escape(c.artifact.detail)}</p></div></section>
      <section class="security-investigation" aria-label="Investigation and response"><div class="security-step-label"><span>01</span><h3>Inspect the evidence</h3><span class="security-evidence-count">${state.inspected.length} / ${c.evidence.length}</span></div><div class="security-evidence-tabs">${c.evidence.map(e=>`<button type="button" data-security-evidence="${e.id}" aria-pressed="${e.id===selected}" class="security-evidence-btn">${state.inspected.includes(e.id)?'<span aria-hidden="true">✓ </span>':''}${escape(e.label)}</button>`).join('')}</div>
      <div class="security-evidence-detail" role="status"><strong>${evidence?escape(evidence.title):'Start with what you can verify.'}</strong><p>${evidence?escape(evidence.detail):'Select an evidence card above. No links, attachments or devices in these scenarios connect to anything real.'}</p></div>
      <div class="security-step-label"><span>02</span><h3>Make the next safe call</h3></div><div class="security-response-actions">${c.actions.map((a,i)=>`<button type="button" class="security-response${state.complete&&a.correct?' is-correct':''}" data-security-response="${a.id}" ${!state.inspected.length||state.complete?'disabled':''}><span aria-hidden="true">${String.fromCharCode(65+i)}</span>${escape(a.label)}<span aria-hidden="true">${state.complete&&a.correct?'✓':'→'}</span></button>`).join('')}</div>
      ${!state.inspected.length?'<p class="security-unlock">Inspect a piece of evidence to choose your response.</p>':''}
      ${feedback?`<div class="security-feedback ${feedback.correct?'is-success':'is-retry'}" role="status" tabindex="-1"><strong>${feedback.correct?'Incident resolved.':'Pause and reassess.'}</strong><p>${escape(feedback.feedback)}</p>${feedback.correct?`<p class="security-takeaway">${escape(c.takeaway)}</p>`:''}</div>`:''}
      ${state.complete?`<div class="security-case-footer">${button('Back to the office →','close','btn btn-primary')}${button('Incident queue','overview')}</div>`:''}
      </section></div>`;
    if(focus==='feedback') content.querySelector('.security-feedback')?.focus();
    else if(focus==='evidence') content.querySelector(`[data-security-evidence="${selected}"]`)?.focus({preventScroll:true});
    else {dialog.scrollTop=0;content.querySelector('h2').focus({preventScroll:true});}
  }
  function close() {
    if(!dialog.open)return;
    dialog.close();
    const target=returnFocus?.isConnected?returnFocus:document.getElementById('security-inbox');
    target?.focus({preventScroll:true});
  }
  function open(id,opener) {
    if(!session?.enabled)return;
    returnFocus=opener;
    if(!dialog.open)dialog.showModal();
    if(id)openIncident(id);else overview();
  }
  document.querySelectorAll('[data-security-open]').forEach(opener=>{
    opener.innerHTML=`${securityIcon()}<span>Security incidents</span>`;
    opener.addEventListener('click',()=>open(null,opener));
  });
  feed.addEventListener('click',event=>{const b=event.target.closest('button');if(b)open(b.dataset.incident,b);});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.getElementById('security-close').addEventListener('click',close);
  document.getElementById('security-pause').addEventListener('click',()=>{close();onPause();});
  content.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target||target.disabled)return;
    if(target.dataset.securityCase)openIncident(target.dataset.securityCase);
    else if(target.dataset.securityEvidence&&state){selected=target.dataset.securityEvidence;session=inspectShiftEvidence(session,state.id,selected);state=session.items.find(i=>i.id===state.id);renderFeed();renderCase('evidence');}
    else if(target.dataset.securityResponse&&state){const change=respondToShiftIncident(session,state.id,target.dataset.securityResponse);if(!change.result.accepted)return;session=change.session;state=change.result.state;feedback=change.result;progress=recordSecurityCompletion(progress,feedback);save();renderFeed();renderCase('feedback');if(feedback.correct)onResolved();}
    else if(target.dataset.securityAction==='overview')overview();
    else if(target.dataset.securityAction==='close')close();
  });
  return {
    isOpen:()=>dialog.open,close,
    begin(options){close();session=createSecurityShift(options);document.querySelectorAll('[data-security-open]').forEach(b=>b.hidden=!session.enabled);feedKey='';renderFeed();},
    reset(){close();session=null;feed.hidden=true;},
    pendingCount:()=>session?securityShiftSummary(session).open:0,
    sync({elapsed,round,clock,running}) {
      if(!session)return;
      const next=advanceSecurityShift(session,{elapsed,round});
      const arrived=next!==session;session=next;renderFeed();
      if(arrived)onArrival(SECURITY_CASES.find(c=>c.id===session.items.at(-1).id).title);
      if(arrived&&dialog.open){if(state)updateProgress();else overview(true);}
      const label=session.practice?'Practice · no time limit':running?clock+' · Shift running — tickets still need you':clock+' · Shift paused';
      const status=document.getElementById('security-shift-status');if(status.textContent!==label)status.textContent=label;
      document.getElementById('security-pause').hidden=!running;
    },
    report(){
      const el=document.getElementById('r-security');el.hidden=!session?.enabled;
      if(!session?.enabled)return;
      const t=securityShiftSummary(session);
      el.innerHTML=`<span class="security-topic-icon">${securityIcon()}</span><div><strong>Security response</strong><p>${t.resolved} resolved · ${t.open} open at handoff · ${firstDecisions(t.firstTry)}</p></div>`;
    }
  };
}
