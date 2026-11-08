/* Recovery overview reflects the shared fictional episode and monitoring scenario. */
VIEWS.overview = function(){
  const done=CHECKLIST.filter(c=>c.done).length;
  const pct=Math.round(done/CHECKLIST.length*100);
  const changed=typeof monitoringState==='undefined'||monitoringState.changed;
  return `<section class="overview-page" aria-labelledby="overview-title">
    <div class="viewhead"><div class="eyebrow">${svg(I.heart)} Fictional recovery episode · Day ${PATIENT.day} of ${PATIENT.episode}</div><h1 id="overview-title">A clearer view.<br>A more connected recovery.</h1><p>Follow Eleanor’s first month home after hip surgery. Her caregiver’s daily tasks, sample wearable trends, and clinical questions come together here.</p></div>
    <section class="overview-patient"><div class="overview-avatar" aria-hidden="true">EW</div><div><span class="overview-label">MEET YOUR SAMPLE PATIENT</span><h2>${PATIENT.name}, ${PATIENT.age}</h2><p>${PATIENT.procedure} · Home with caregiver ${PATIENT.aide}</p></div><span class="pill p-prim">Day ${PATIENT.day} / ${PATIENT.episode}</span></section>
    <section class="overview-concern ${changed?'overview-concern-active':''}" aria-label="Sample recovery status"><div class="overview-concern-icon">${svg(changed?I.bell:I.check)}</div><div><h2>${changed?'A change worth a closer look':'Following the sample recovery trend'}</h2><p>${changed?'New incision redness and discomfort accompany lower mobility and interrupted sleep in this fictional scenario. Review the observations and prepare a summary for the nurse.':'The selected sample shows consistent activity and no new caregiver concerns. Continue reviewing the prescribed daily routine.'}</p></div><button class="btn" onclick="go('monitor')">Review signals ${svg(I.arrow)}</button></section>
    <div class="tiles overview-tiles">
      <article class="tile"><div class="tl">${svg(I.check)} Daily tasks</div><div class="tv">${done}<small> / ${CHECKLIST.length}</small></div><div class="tm">${pct}% of today’s checklist completed</div></article>
      <article class="tile"><div class="tl">${svg(I.wound)} Caregiver concern</div><div class="tv overview-status ${changed?'s-crit':'s-good'}">${changed?'Needs review':'No new change'}</div><div class="tm">${changed?'Sample incision observation, 11:20':'Illustrative observation log'}</div></article>
      <article class="tile"><div class="tl">${svg(I.walk)} Mobility today</div><div class="tv">${changed?'110':'460'}<small> steps</small></div><div class="tm">${changed?'470-step illustrative target':'Following the illustrative trend'}</div></article>
      <article class="tile"><div class="tl">${svg(I.sleep)} Sleep interruptions</div><div class="tv">${changed?'7':'2'}<small> awakenings</small></div><div class="tm">Fictional wearable data</div></article>
    </div>
    <div class="grid g-2-1 overview-content"><section class="card"><div class="card-h"><span class="ic">${svg(I.doc)}</span><h2>The next step, made clearer</h2></div><div class="overview-actions">${[
      ['plan','01','Start with the discharge plan','Explore the fictional instructions and organize a plan for licensed review.'],
      ['today','02','Support the caregiver’s day','Complete prescribed tasks and keep track of the daily routine.'],
      ['monitor','03','Bring the observations together','Compare activity and sleep with what the caregiver notices.'],
      ['clinical','04','Prepare a nurse review','Draft a structured summary; licensed professionals decide the care.']
    ].map(([route,n,title,desc])=>`<button class="overview-action" onclick="go('${route}')"><span class="overview-action-number">${n}</span><span><strong>${title}</strong><span>${desc}</span></span><span class="overview-action-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
    <aside><section class="card"><div class="card-h"><span class="ic">${svg(I.heart)}</span><h2>Eleanor’s sample care team</h2></div><dl class="overview-team">${[['Supervising nurse',PATIENT.nurse],['Pharmacist',PATIENT.pharmacist],['Physical therapist',PATIENT.pt],['Home aide',PATIENT.aide],['Family',PATIENT.family]].map(([role,name])=>`<div><dt>${role}</dt><dd>${name}</dd></div>`).join('')}</dl><button class="btn overview-team-button" onclick="go('coord')">Open care coordination ${svg(I.arrow)}</button></section><div class="overview-note">${svg(I.shield)}<p><strong>Clinical oversight stays human.</strong><br>This prototype uses scripted plans and simulated data. No clinical service or real messaging is connected.</p></div></aside></div>
    ${footer()}</section>`;
};
