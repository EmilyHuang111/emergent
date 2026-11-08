/* Discharge-plan component. All uploaded text stays in this browser session. */
const planSampleText = DISCHARGE_TEXT.replace(/<\/?b>/g, '');
const planState = { text: planSampleText, filename: 'Eleanor_discharge_sample.txt', ready: false, busy: false, error: '', uploadVersion: 0 };

function planEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function planUpdate(text) {
  planState.text = text;
  planState.ready = false;
  planState.error = '';
  const output = document.getElementById('planOutput');
  if (output) output.hidden = true;
  const status = document.getElementById('planStatus');
  if (status) status.textContent = 'Instructions changed. Generate a new preview to update the plan.';
}

async function planUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const version = ++planState.uploadVersion;
  if (!/\.txt$/i.test(file.name) || file.size > 100000) {
    planState.error = 'Choose a plain-text (.txt) fictional discharge summary smaller than 100 KB.';
  } else {
    try {
      const contents = await file.text();
      if (version !== planState.uploadVersion) return;
      if (!contents.trim()) throw new Error('empty');
      planState.text = contents;
      planState.filename = file.name;
      planState.ready = false;
      planState.error = '';
    } catch (error) {
      planState.error = 'This file could not be read or is empty. Try another .txt file.';
    }
  }
  if (current === 'plan') renderView();
}

function planReset() {
  planState.uploadVersion++;
  Object.assign(planState, { text: planSampleText, filename: 'Eleanor_discharge_sample.txt', ready: false, busy: false, error: '' });
  renderView();
}

function planGenerate() {
  if (!planState.text.trim()) {
    planState.error = 'Add fictional discharge instructions before creating a preview.';
    renderView();
    return;
  }
  planState.ready = true;
  planState.error = '';
  renderView();
  document.getElementById('planOutput')?.focus();
}

function planCustomGroups() {
  const groups = [];
  const categories = [
    ['Medication instructions', /medication|medicine|dose|\bmg\b|pharmacist|\bhold\b/i],
    ['Movement & rehabilitation', /walk|rehab|exercise|activity|physio|\bPT\b|precaution/i],
    ['Meals & daily routines', /diet|protein|fluid|water|nutrition|glucose/i],
    ['Changes to report', /wound|incision|fever|redness|drainage|call|warning|pain|swelling/i],
    ['Follow-up & coordination', /follow.up|appointment|visit|PCP|ortho|telehealth/i]
  ];
  const lines = planState.text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 8);
  categories.forEach(([title, pattern]) => {
    const matches = lines.filter(line => pattern.test(line));
    if (matches.length) groups.push({ title, lines: matches.slice(0, 8) });
  });
  return groups;
}

function planResults() {
  const isSample = planState.text === planSampleText;
  if (!isSample) {
    const groups = planCustomGroups();
    return `<div class="plan-result-intro"><span class="pill p-warn">Draft · requires nurse review</span><h2>Your instructions, organized</h2><p>This local preview groups matching lines from your text. It does not infer doses, schedules, diagnoses, or missing instructions. A nurse must confirm the plan.</p></div>
      ${groups.length ? `<div class="plan-results-grid">${groups.map(group => `<section class="plan-group"><h3>${group.title}</h3><ul>${group.lines.map(line => `<li>${planEscape(line)}</li>`).join('')}</ul></section>`).join('')}</div>` : '<p>No recognizable task categories were found. Add clear medication, movement, nutrition, warning-sign, or follow-up instructions.</p>'}
      <p class="plan-small">Uploaded instructions are separate from Eleanor’s scripted checklist and clinical demo.</p>`;
  }
  return `<div class="plan-result-intro"><span class="pill p-warn">Illustrative draft · nurse confirmation needed</span><h2>A clearer plan for Eleanor</h2><p>The sample’s prepared plan brings medications, movement, and follow-up into one daily routine.</p></div>
    <div class="plan-summary"><div><b>6</b><span>medications organized</span></div><div><b>4</b><span>prescribed rehab exercises</span></div><div><b>3</b><span>follow-ups to coordinate</span></div></div>
    <div class="plan-results-grid"><section class="plan-group"><h3>Daily caregiver routine</h3><ul><li>Support the prescribed medication schedule and record completed tasks.</li><li>Assist with the prescribed walker routine and rehabilitation exercises.</li><li>Record meals, fluids, and any changes around the incision.</li><li>Bring medication questions and new concerns to the supervising nurse.</li></ul></section><section class="plan-group plan-review"><h3>Keep clinical decisions with clinicians</h3><p>The sample summary says to hold metformin pending PCP reconciliation. Its restart timing needs a clinician’s confirmation.</p><span class="pill p-warn">Medication question for pharmacist review</span></section></div>
    <div class="plan-medications"><h3>Medication instructions from the sample</h3><div class="tbl-scroll"><table class="med"><thead><tr><th>Medication</th><th>Dose</th><th>When</th><th>Purpose</th><th>Note</th></tr></thead><tbody>${MEDS.map(med => `<tr><td class="m-name">${planEscape(med.name)}</td><td>${planEscape(med.dose)}</td><td>${planEscape(med.freq)}</td><td>${planEscape(med.purpose)}</td><td>${planEscape(med.note)}</td></tr>`).join('')}</tbody></table></div></div>
    <button class="btn prim" onclick="go('today')">Open Eleanor’s daily checklist ${svg(I.arrow, 2)}</button>`;
}

VIEWS.plan = function () {
  return `<div class="plan-page"><div class="viewhead"><div class="eyebrow"><span class="step">1</span> Discharge to daily care</div><h1>Complex instructions.<br>A clearer way forward.</h1><p>Give caregivers an organized starting point, with every clinical decision kept under licensed supervision.</p></div>
    <div class="plan-layout"><section class="card plan-document"><div class="card-h"><span class="ic">${svg(I.doc, 2)}</span><h2>Start with the instructions</h2><span class="pill p-ink">Fictional data only</span></div><p class="lead">Explore Eleanor’s sample, edit the text, or choose a fictional discharge summary.</p>
      <div class="plan-upload"><label class="plan-file-label" for="planFile">${svg(I.doc, 2)} Choose a .txt file</label><input id="planFile" class="plan-file-input" type="file" accept=".txt,text/plain" onchange="planUpload(this)" aria-describedby="planUploadHelp"><button class="btn sm ghost" onclick="planReset()">Use Eleanor’s sample</button></div>
      <p id="planUploadHelp" class="plan-small">Plain text · maximum 100 KB · stays in this browser session</p><label class="plan-text-label" for="planInstructions">${planEscape(planState.filename)}</label><textarea id="planInstructions" class="plan-instructions" rows="18" oninput="planUpdate(this.value)" spellcheck="false">${planEscape(planState.text)}</textarea>
      <p class="plan-error" role="alert">${planEscape(planState.error)}</p></section>
    <aside class="plan-guide"><div class="plan-guide-icon">${svg(I.spark, 1.7)}</div><span class="eyebrow">A little structure. More confidence.</span><h2>A plan the whole<br>care team can follow.</h2><p>Turn a dense packet into categories caregivers can understand and a nurse can review.</p><ol><li><span>01</span><div><b>Start with the discharge summary</b><p>Use only fictional information in this demo.</p></div></li><li><span>02</span><div><b>Organize what matters</b><p>Medication instructions, movement, daily routines, changes, and follow-up.</p></div></li><li><span>03</span><div><b>Bring a clinician into the loop</b><p>Confirm instructions and resolve discrepancies before acting.</p></div></li></ol>
      <button class="btn prim" onclick="planGenerate()">Generate a plan preview ${svg(I.arrow, 2)}</button><p class="plan-small" id="planStatus" role="status">Interactive prototype: Eleanor’s plan is scripted; uploaded text uses local keyword grouping. No live AI service is connected.</p></aside></div>
    <section id="planOutput" class="card plan-output" tabindex="-1" ${planState.ready ? '' : 'hidden'}>${planState.ready ? planResults() : ''}</section>${footer()}</div>`;
};
