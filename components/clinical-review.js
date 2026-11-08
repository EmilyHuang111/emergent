/* Nurse review is a local, fictional workflow; it never sends clinical messages. */
const clinicalState = { draft:null, scenario:null, acknowledged:false, status:'' };
function clinicalEscape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function clinicalChanged(){return typeof monitoringState==='undefined'||monitoringState.changed;}
function clinicalDraftText(){
  return clinicalState.draft.map(([label,text])=>label.toUpperCase()+'\n'+text).join('\n\n');
}
VIEWS.clinical = function(){
  const changed=clinicalChanged();
  if(clinicalState.scenario!==null && clinicalState.scenario!==changed){clinicalState.draft=null;clinicalState.acknowledged=false;clinicalState.status='Monitoring scenario changed. Create a new draft for the current sample.';}
  const done=CHECKLIST.filter(c=>c.done).length;
  return `<section class="clinical-page" aria-labelledby="clinical-heading">
    <div class="viewhead"><div class="eyebrow"><span class="step">4</span> Document & review</div><h1 id="clinical-heading">The full picture.<br>A human decision.</h1><p>Turn caregiver observations and recovery trends into a structured handoff for Eleanor’s supervising nurse. Clinical judgment stays with a licensed professional.</p></div>
    <div class="clinical-demo-note">${svg(I.shield)}<div><b>Fictional nurse-review workspace</b><p>Drafts and review actions stay in this browser session. No messages are sent, and no treatment decisions are carried out.</p></div></div>
    <div class="grid g-2-1">
      <article class="card pad-lg"><div class="card-h"><span class="ic">${svg(I.doc)}</span><h2>Recovery handoff</h2><span class="sub">SBAR format</span></div><p class="lead">Situation, background, observations for assessment, and questions for review. This sample draft is scripted from Eleanor’s fictional scenario.</p>
        <button class="btn prim" onclick="createClinicalDraft()">${svg(I.spark)} ${clinicalState.draft?'Rebuild sample draft':'Draft nurse-review summary'}</button>
        ${clinicalState.draft?`<div class="clinical-draft"><div class="clinical-draft-label"><span class="pill ${clinicalState.acknowledged?'p-good':'p-warn'}">${clinicalState.acknowledged?'Demo review recorded':'Draft · requires nurse review'}</span><span>Editable local copy</span></div>${clinicalState.draft.map(([label,text],i)=>`<label class="clinical-field" for="clinical-field-${i}"><span>${label}</span><textarea id="clinical-field-${i}" rows="${i===1?5:4}" oninput="updateClinicalField(${i},this.value)">${clinicalEscape(text)}</textarea></label>`).join('')}<div class="clinical-actions"><button class="btn" onclick="copyClinicalDraft()">Copy summary</button><button class="btn" onclick="downloadClinicalDraft()">Download .txt</button><button class="btn prim clin-only" onclick="acknowledgeClinicalDraft()">${svg(I.check)} Record demo nurse review</button></div><p class="care-only muted">Switch to Clinician in the header to try recording a simulated nurse review.</p></div>`:`<div class="clinical-empty">${svg(I.doc)}<h3>A clear handoff starts here.</h3><p>Create the sample draft, then edit or download it for demonstration.</p></div>`}
        <p id="clinical-status" class="clinical-status" role="status">${clinicalEscape(clinicalState.status)}</p>
      </article>
      <aside class="clinical-sidebar"><article class="card"><div class="card-h"><span class="ic">${svg(I.pulse)}</span><h2>Evidence in context</h2></div><p class="muted">${changed?'Reduced-mobility':'Illustrative recovery'} scenario · Day 5</p><dl class="clinical-evidence">${[['Steps today',changed?'110 / 470 target':'460 / 470 target'],['Night awakenings',changed?'7 (Day 1: 2)':'2 (Day 1: 2)'],['Caregiver observation',changed?'New incision redness, warmth, and pain':'No new concerns in sample'],['Temperature','Not documented'],['Tasks completed',done+' / '+CHECKLIST.length]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><button class="btn ghost sm" onclick="go('monitor')">Review sample signals ${svg(I.arrow)}</button></article><article class="card clinical-oversight"><span class="eyebrow">LICENSED OVERSIGHT</span><h3>${PATIENT.nurse}</h3><p>Supervising nurse in this fictional episode.</p><p>Wearable trends add context. They cannot establish a diagnosis or replace assessment. The nurse verifies the record and decides whether further clinical evaluation is needed.</p><p class="clin-only"><b>Review checklist:</b> confirm observations, reconcile missing information, and determine the appropriate clinical response.</p></article></aside>
    </div>${footer()}</section>`;
};
function createClinicalDraft(){
  const changed=clinicalChanged();
  clinicalState.scenario=changed;clinicalState.acknowledged=false;
  clinicalState.draft=changed?[
    ['Situation','Eleanor Whitfield, 82, is home after right total hip replacement on October 31. On recovery Day 5, her caregiver reports new incision redness and warmth, throbbing pain, and guarded weight-bearing.'],
    ['Background','Fictional discharge November 3, 2026. Posterior hip precautions and a walker are prescribed. The discharge medication list includes apixaban, scheduled acetaminophen, PRN oxycodone, and metformin held pending PCP reconciliation. New incision redness and uncontrolled pain are listed return precautions.'],
    ['Observations for assessment','Sample steps declined from 430 on Day 3 to 110 today, versus an illustrative target of 470. Seven night awakenings are recorded. The caregiver describes a roughly 2 cm area of new redness and warmth. Temperature is not documented. These are unverified observations for licensed assessment, not an AI diagnosis.'],
    ['Questions for nurse review','Please verify the caregiver report and assess the new incision changes and pain against the discharge instructions. Clarify what additional information or evaluation is needed and confirm the appropriate next steps. Medication changes and rehabilitation decisions require the relevant licensed clinician.']
  ]:[
    ['Situation','Eleanor Whitfield, 82, is recovering at home after right total hip replacement. The selected illustrative recovery scenario has no new caregiver concerns.'],
    ['Background','Fictional discharge November 3, 2026. Prescribed hip precautions, walker use, rehabilitation, and medication reconciliation remain part of the discharge plan.'],
    ['Observations for assessment','Sample wearable data shows 460 steps against an illustrative target of 470 and two night awakenings. Sample caregiver observations describe completion of morning exercises and a short supported walk. These fictional data do not establish clinical status.'],
    ['Questions for nurse review','Review routine recovery documentation and outstanding medication-reconciliation questions. Verify observations and confirm whether any follow-up is needed. No escalation or treatment decision is inferred automatically.']
  ];
  clinicalState.status='Scripted sample draft created. Review and edit before using it in a demonstration.';
  renderView();
}
function updateClinicalField(index,text){
  clinicalState.draft[index][1]=text;clinicalState.acknowledged=false;
  clinicalState.status='Draft edited. Demo nurse review is pending.';
  document.getElementById('clinical-status').textContent=clinicalState.status;
  const pill=document.querySelector('.clinical-draft-label .pill');if(pill){pill.className='pill p-warn';pill.textContent='Draft · requires nurse review';}
}
async function copyClinicalDraft(){
  try{await navigator.clipboard.writeText(clinicalDraftText());clinicalState.status='Summary copied to your clipboard.';}catch(e){clinicalState.status='Clipboard access is unavailable. Use Download .txt to save the summary.';}
  const el=document.getElementById('clinical-status');if(el)el.textContent=clinicalState.status;
}
function downloadClinicalDraft(){
  const blob=new Blob(['FICTIONAL CAREBRIDGE DEMO — NOT A CLINICAL RECORD\n\n'+clinicalDraftText()],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='carebridge-fictional-nurse-summary.txt';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  clinicalState.status='Fictional summary downloaded as a text file.';document.getElementById('clinical-status').textContent=clinicalState.status;
}
function acknowledgeClinicalDraft(){
  if(document.body.dataset.persona!=='clinician')return;
  clinicalState.acknowledged=true;clinicalState.status='Simulated nurse review recorded for this session. No clinician was contacted and no clinical action was taken.';renderView();
}
