/* Coordination is a local demonstration; actions never send messages. */
const coordinationState = { confirmed: new Set(), questions: [], preview: false, draft: '' };
function coordEscape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
VIEWS.coord = function(){
  const s=coordinationState;
  return `<section class="coordination-page">
  <div class="viewhead"><div class="eyebrow">${svg(I.link)} One connected care team</div>
    <h1>Keep everyone on the same page.</h1>
    <p>Track visits, organize medication questions, and prepare a clear family update. Every action below stays in this fictional recovery episode.</p>
  </div>
  <div class="coord-demo-note">${svg(I.shield)} Local demonstration · confirmations and messages are simulated; nothing is sent.</div>
  <div class="grid g-1-2">
    <div class="coord-column">
      <div class="card"><div class="card-h"><span class="ic">${svg(I.cal)}</span><h3>Upcoming visits</h3></div>
      ${APPTS.map((a,i)=>`<article class="coord-visit"><div class="coord-visit-date">${a.d}<small>${a.dd}</small></div><div><h4>${a.t}</h4><p>${a.who}</p><span class="pill ${s.confirmed.has(i)?'p-good':a.tag}">${s.confirmed.has(i)?'Confirmed in demo':a.tagt}</span>${a.tagt!=='Confirmed'?`<button class="btn sm coord-confirm" onclick="coordConfirm(${i})" ${s.confirmed.has(i)?'disabled':''}>${s.confirmed.has(i)?'Confirmation recorded':'Record confirmation'}</button>`:''}</div></article>`).join('')}
      <p class="coord-small">Record a confirmation after the provider has confirmed the visit. This demo does not contact providers.</p></div>
      <div class="card"><div class="card-h"><span class="ic">${svg(I.pill)}</span><h3>Medication questions</h3></div>
        <div class="alert warn"><span class="ai">${svg(I.warn)}</span><div><h4>Metformin restart unresolved</h4><p>The discharge summary says to hold metformin. A licensed prescriber or pharmacist must reconcile this question; the demo does not recommend a medication change.</p></div></div>
        <p class="coord-small">Review owner: ${PATIENT.pharmacist}</p>
        <label class="coord-label" for="coord-question">Add a fictional question for professional review</label>
        <textarea id="coord-question" class="coord-textarea" maxlength="500" rows="3" placeholder="e.g., Has the PCP clarified the held medication?"></textarea>
        <button class="btn sm" onclick="coordAddQuestion()">${svg(I.link)} Add to demo review queue</button>
        <p id="coord-question-status" role="status" class="coord-small"></p>
        ${s.questions.length?`<ul class="coord-question-list">${s.questions.map(q=>`<li><p>${coordEscape(q)}</p><span class="pill p-warn">Awaiting licensed review · demo</span></li>`).join('')}</ul>`:''}
      </div>
    </div>
    <div class="card"><div class="card-h"><span class="ic">${svg(I.phone)}</span><h3>Family update</h3><span class="sub">For ${PATIENT.family}</span></div>
      <div class="coord-family-intro"><span class="coord-family-avatar">CW</span><div><b>A clear update. A calmer family.</b><p>Prepare a plain-language draft for the care team to review.</p></div></div>
      <label class="coord-label" for="coord-family-draft">Draft update</label>
      <textarea id="coord-family-draft" class="coord-textarea" rows="8" maxlength="2000" oninput="coordinationState.draft=this.value" placeholder="Write an update about Eleanor’s recovery…">${coordEscape(s.draft||coordDefaultUpdate())}</textarea>
      <div class="coord-actions"><button class="btn prim" onclick="coordPreview()">${svg(I.doc)} Preview update</button><button class="btn ghost" onclick="coordUseTemplate()">Use recovery template</button></div>
      <div id="coord-preview" ${s.preview?'':'hidden'} class="coord-preview" aria-live="polite"><div class="eyebrow">Draft for care-team review</div><p id="coord-preview-text">${coordEscape(s.draft||coordDefaultUpdate())}</p><span class="pill p-ink">Not sent</span></div>
      <div class="callout"><span class="cai">${svg(I.shield)}</span><div>Clinical questions go to a licensed professional. A family update should describe observations and review status without promising a diagnosis, urgency level, or response time.</div></div>
    </div>
  </div>${footer()}</section>`;
};
function coordDefaultUpdate(){
  const done=CHECKLIST.filter(task=>task.done);
  const changed=typeof monitoringState==='undefined'||monitoringState.changed;
  const completion=done.length?`${done.length} of ${CHECKLIST.length} daily tasks are marked complete in the fictional checklist. Completed tasks: ${done.map(task=>task.t).join('; ')}.`:`No daily tasks are marked complete in the fictional checklist.`;
  const observations=changed?'The caregiver recorded new redness and warmth near the incision. Simulated wearable readings also show reduced activity and more sleep interruptions. These observations need review by the supervising nurse.':'The current simulated scenario shows 460 steps and two night awakenings. The sample caregiver observation reports a short walk and no new concerns. This illustrative pattern does not establish a clinical assessment.';
  return `Eleanor’s Day 5 recovery update\n\n${completion}\n\n${observations}\n\nThe held-medication question remains open for the pharmacist and PCP. The next home PT visit is listed for November 9.\n\nThis draft is awaiting care-team review. No clinical decision or message has been sent.`;
}
function coordConfirm(index){if(!APPTS[index])return;coordinationState.confirmed.add(index);renderView();}
function coordAddQuestion(){
  const input=document.getElementById('coord-question'),status=document.getElementById('coord-question-status');
  const value=input.value.trim();
  if(!value){status.textContent='Enter a fictional question first.';input.focus();return;}
  coordinationState.questions.push(value.slice(0,500));renderView();
  document.getElementById('coord-question-status').textContent='Added to the local demo queue. No professional has been contacted.';
}
function coordPreview(){
  coordinationState.draft=document.getElementById('coord-family-draft').value.trim();
  if(!coordinationState.draft){document.getElementById('coord-family-draft').focus();return;}
  coordinationState.preview=true;
  document.getElementById('coord-preview').hidden=false;
  document.getElementById('coord-preview-text').textContent=coordinationState.draft;
}
function coordUseTemplate(){coordinationState.draft=coordDefaultUpdate();coordinationState.preview=false;renderView();}
