/* ---------- TODAY ---------- */
VIEWS.today = function(){
  const done=CHECKLIST.filter(c=>c.done).length, pct=Math.round(done/CHECKLIST.length*100);
  return `
  <div class="viewhead">
    <div class="eyebrow"><span class="step">2</span> Guide caregiving</div>
    <h1>A clear plan. A more confident day.</h1>
    <p>Maria's checklist for Eleanor's fictional recovery. Follow the prescribed plan, record completed tasks, and bring changes to the supervising nurse.</p>
  </div>
  <p class="persona-note">${svg(I.heart,2)} Written for the home aide — plain steps, no clinical jargon.</p>

  <div class="grid g-2-1">
    <div class="card pad-lg">
      <div class="card-h"><span class="ic">${svg(I.check,2)}</span><h3>Daily checklist</h3>
        <span class="sub"><span id="chkCount" aria-live="polite">${done}</span>/${CHECKLIST.length} done</span></div>
      <div class="progress" id="dailyProgress" role="progressbar" aria-label="Tasks completed" aria-valuemin="0" aria-valuemax="${CHECKLIST.length}" aria-valuenow="${done}" style="margin-bottom:6px"><i id="chkBar" style="width:${pct}%"></i></div>
      <div class="muted" style="margin-bottom:12px">Mark each completed task. This fictional schedule follows Eleanor's sample discharge plan.</div>
      <ul class="klist" id="klist">
        ${CHECKLIST.map(c=>`
          <li class="kitem ${c.done?'done':''}" id="k-${c.id}">
            <input class="daily-check" type="checkbox" id="daily-check-${c.id}" ${c.done?'checked':''} onchange="dailyToggle('${c.id}',this.checked)" aria-labelledby="daily-label-${c.id}" aria-describedby="daily-meta-${c.id}">
            <div style="flex:1;min-width:0"><label class="ktitle" id="daily-label-${c.id}" for="daily-check-${c.id}">${c.t}</label><div class="kmeta" id="daily-meta-${c.id}">${c.m}</div></div>
            <span class="ktime mono">${c.time}</span>
          </li>`).join('')}
      </ul>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-h"><span class="ic">${svg(I.walk,2)}</span><h3>Prescribed rehab set</h3></div>
        <div class="howto">
          <div class="step-card"><div class="sn">1</div><div><b>Ankle pumps ×10</b><p>Follow the physical therapist’s instructions for the sample exercise plan.</p></div></div>
          <div class="step-card"><div class="sn">2</div><div><b>Glute sets ×10</b><p>Use the technique and precautions provided by the physical therapist.</p></div></div>
          <div class="step-card"><div class="sn">3</div><div><b>Quad sets ×10</b><p>Follow the prescribed technique; this demo does not adjust exercise intensity.</p></div></div>
        </div>
        <div class="callout" style="margin-top:14px"><span class="cai">${svg(I.warn,2.2)}</span>
          <div><b>Pause and contact the care team</b> if pain or movement changes. A licensed clinician decides the next step.</div></div>
      </div>
      <div class="card">
        <div class="card-h"><span class="ic">${svg(I.food,2)}</span><h3>Nutrition & fluids</h3></div>
        <div style="display:flex;flex-direction:column;gap:9px;font-size:13.5px">
          <div style="display:flex;justify-content:space-between"><span>High-protein meals</span><span class="pill p-good">sample log</span></div>
          <div style="display:flex;justify-content:space-between"><span>Fluids toward 2 L</span><span class="pill p-warn">1.1 L · sample</span></div>
          <div style="display:flex;justify-content:space-between"><span>Glucose check (diabetes)</span><span class="pill p-ink">due 1:00 PM</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="daily-next"><span>Something feels different today?</span><button class="btn ghost sm" onclick="go('monitor')">Review observations ${svg(I.arrow)}</button></div>
  ${footer()}`;
};

// Update shared episode tasks so the overview reflects the same completion count.
function dailyToggle(id, checked) {
  const task = CHECKLIST.find(item => item.id === id);
  if (!task) return;
  task.done = Boolean(checked);
  document.getElementById('k-' + id).classList.toggle('done', task.done);
  const done = CHECKLIST.filter(item => item.done).length;
  const percent = Math.round(done / CHECKLIST.length * 100);
  document.getElementById('chkCount').textContent = done;
  document.getElementById('chkBar').style.width = percent + '%';
  document.getElementById('dailyProgress').setAttribute('aria-valuenow', done);
  try { sessionStorage.setItem('cb-demo-checklist', JSON.stringify(CHECKLIST.map(item => ({id:item.id,done:item.done})))); } catch (error) {}
}
try {
  const saved = JSON.parse(sessionStorage.getItem('cb-demo-checklist') || 'null');
  if (Array.isArray(saved)) CHECKLIST.forEach(task => {
    const record = saved.find(item => item.id === task.id);
    if (record && typeof record.done === 'boolean') task.done = record.done;
  });
} catch (error) { /* Shared in-memory state works when storage is unavailable. */ }
