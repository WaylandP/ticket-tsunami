import {SECURITY_CASES,SECURITY_STORAGE_KEY,createSecurityCase,inspectSecurityEvidence,respondToSecurityCase,parseSecurityProgress,recordSecurityCompletion} from './security.js';
import {securityIcon,securityArtifactSVG} from './icons.js';

export function initSecurityLab() {
  const dialog=document.getElementById('security-dialog'), content=document.getElementById('security-content');
  let progress;
  try {progress=parseSecurityProgress(localStorage.getItem(SECURITY_STORAGE_KEY));} catch {progress=parseSecurityProgress(null);}
  let state=null,selected=null,feedback=null,returnFocus=null;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button=(label,action,cls='btn btn-ghost')=>`<button type="button" class="${cls}" data-security-action="${action}">${label}</button>`;
  function save() {try {localStorage.setItem(SECURITY_STORAGE_KEY,JSON.stringify(progress));} catch {/* Browser-local progress is optional. */}}
  function updateProgress() {
    document.getElementById('security-progress').textContent=`${progress.completed.length} / ${SECURITY_CASES.length} cases closed`;
    document.getElementById('security-progress-fill').style.width=`${progress.completed.length/SECURITY_CASES.length*100}%`;
  }
  function overview() {
    state=null;selected=null;feedback=null;updateProgress();
    const complete=progress.completed.length===SECURITY_CASES.length;
    content.innerHTML=`<section class="security-intro"><div><p class="eyebrow">${complete?'DEBRIEF / ALL CASES CLOSED':'OBSERVE. VERIFY. RESPOND.'}</p><h2 tabindex="-1" id="security-screen-title">${complete?'A safer day at the office.':'Good instincts. Better evidence.'}</h2><p>${complete?`You closed all six cases. ${progress.firstTry.length} safe first decisions. Revisit any case to practice again.`:'Investigate six everyday security incidents. Inspect the evidence, choose a response, and learn why it works.'}</p><span class="security-training-note">Fictional training · no time limit · progress saved on this browser</span></div><div class="security-hero-art">${securityArtifactSVG()}</div></section>
      <div class="security-case-grid">${SECURITY_CASES.map((c,i)=>`<button type="button" class="security-case-card${progress.completed.includes(c.id)?' is-complete':''}" data-security-case="${c.id}"><span class="security-card-top"><span class="security-topic-icon">${securityIcon(c.kind)}</span><span class="security-case-index">${progress.completed.includes(c.id)?'✓ CLOSED':String(i+1).padStart(2,'0')+' / '+c.duration}</span></span><strong>${escape(c.title)}</strong><span>${escape(c.topic)}</span><span class="security-card-go">${progress.completed.includes(c.id)?'Practice again':'Open case'} <span aria-hidden="true">↗</span></span></button>`).join('')}</div>
      <p class="security-footnote">In a real incident, follow your organization’s response plan and contact its security team.</p>`;
    dialog.scrollTop=0;
    content.querySelector('h2').focus({preventScroll:true});
  }
  function renderCase(focus='title') {
    const c=SECURITY_CASES.find(c=>c.id===state.id), evidence=c.evidence.find(e=>e.id===selected),index=SECURITY_CASES.indexOf(c);
    updateProgress();
    content.innerHTML=`<div class="security-case-heading">${button('← All cases','overview','btn-link')}<span class="security-case-index">CASE ${String(index+1).padStart(2,'0')} / ${escape(c.topic).toUpperCase()}</span></div>
      <h2 tabindex="-1" id="security-screen-title">${escape(c.title)}</h2><p class="security-scenario">${escape(c.intro)}</p>
      <div class="security-workspace"><section class="security-artifact" aria-label="Scenario evidence"><div class="security-artifact-top"><span class="security-topic-icon">${securityIcon(c.kind)}</span><span>${escape(c.artifact.eyebrow)}</span><span class="security-sim-tag">SIMULATION</span></div><div class="security-object">${securityArtifactSVG(c.kind)}</div><div class="security-artifact-copy"><h3>${escape(c.artifact.title)}</h3><p class="security-artifact-from">${escape(c.artifact.from)}</p><p>${escape(c.artifact.body)}</p><p class="security-artifact-detail">${escape(c.artifact.detail)}</p></div></section>
      <section class="security-investigation" aria-label="Investigation and response"><div class="security-step-label"><span>01</span><h3>Inspect the evidence</h3><span class="security-evidence-count">${state.inspected.length} / ${c.evidence.length}</span></div><div class="security-evidence-tabs">${c.evidence.map(e=>`<button type="button" data-security-evidence="${e.id}" aria-pressed="${e.id===selected}" class="security-evidence-btn">${state.inspected.includes(e.id)?'<span aria-hidden="true">✓ </span>':''}${escape(e.label)}</button>`).join('')}</div>
      <div class="security-evidence-detail" role="status"><strong>${evidence?escape(evidence.title):'Start with what you can verify.'}</strong><p>${evidence?escape(evidence.detail):'Select an evidence card above. No links, attachments or devices in these scenarios connect to anything real.'}</p></div>
      <div class="security-step-label"><span>02</span><h3>Make the next safe call</h3></div><div class="security-response-actions">${c.actions.map((a,i)=>`<button type="button" class="security-response${state.complete&&a.correct?' is-correct':''}" data-security-response="${a.id}" ${!state.inspected.length||state.complete?'disabled':''}><span aria-hidden="true">${String.fromCharCode(65+i)}</span>${escape(a.label)}<span aria-hidden="true">${state.complete&&a.correct?'✓':'→'}</span></button>`).join('')}</div>
      ${!state.inspected.length?'<p class="security-unlock">Inspect a piece of evidence to choose your response.</p>':''}
      ${feedback?`<div class="security-feedback ${feedback.correct?'is-success':'is-retry'}" role="status" tabindex="-1"><strong>${feedback.correct?'Case closed.':'Pause and reassess.'}</strong><p>${escape(feedback.feedback)}</p>${feedback.correct?`<p class="security-takeaway">${escape(c.takeaway)}</p>`:''}</div>`:''}
      ${state.complete?`<div class="security-case-footer">${button(index===SECURITY_CASES.length-1?'View debrief →':'Next case →','next','btn btn-primary')}${button('All cases','overview')}</div>`:''}
      </section></div>`;
    if(focus==='feedback') content.querySelector('.security-feedback')?.focus();
    else if(focus==='evidence') content.querySelector(`[data-security-evidence="${selected}"]`)?.focus({preventScroll:true});
    else {dialog.scrollTop=0;content.querySelector('h2').focus({preventScroll:true});}
  }
  function close() {dialog.close();returnFocus?.focus({preventScroll:true});}
  document.querySelectorAll('[data-security-open]').forEach(opener=>{
    opener.innerHTML=`${securityIcon()}<span>Cyber lab</span>`;
    opener.addEventListener('click',()=>{returnFocus=opener;dialog.showModal();overview();});
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.getElementById('security-close').addEventListener('click',close);
  content.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target||target.disabled)return;
    if(target.dataset.securityCase){state=createSecurityCase(target.dataset.securityCase);selected=null;feedback=null;renderCase();}
    else if(target.dataset.securityEvidence&&state){selected=target.dataset.securityEvidence;state=inspectSecurityEvidence(state,selected);renderCase('evidence');}
    else if(target.dataset.securityResponse&&state){const result=respondToSecurityCase(state,target.dataset.securityResponse);if(!result.accepted)return;state=result.state;feedback=result;progress=recordSecurityCompletion(progress,result);save();renderCase('feedback');}
    else if(target.dataset.securityAction==='overview')overview();
    else if(target.dataset.securityAction==='next'&&state?.complete){const index=SECURITY_CASES.findIndex(c=>c.id===state.id);if(index===SECURITY_CASES.length-1)overview();else{state=createSecurityCase(SECURITY_CASES[index+1].id);selected=null;feedback=null;renderCase();}}
  });
  return {isOpen:()=>dialog.open};
}
