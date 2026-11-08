/* Fictional wearable scenarios. These demonstrate a workflow, not a clinical model. */
const monitoringState = { changed: true, analyzed: false };

VIEWS.monitor = function () {
  const changed = monitoringState.changed;
  return `<section class="monitor-page" aria-labelledby="monitor-heading">
    <div class="viewhead">
      <div class="eyebrow"><span class="step">3</span> A clearer picture of recovery</div>
      <h1 id="monitor-heading">Notice the changes.<br>Connect the right care.</h1>
      <p>Wearable activity and sleep trends add context to what Eleanor’s caregiver observes, so her nurse can review concerns with the full picture.</p>
    </div>
    <div class="monitor-scenario">
      <div><span class="monitor-label">FICTIONAL WEARABLE FEED</span><h2>Explore a change in recovery</h2><p>Switch between an illustrative recovery trend and reduced mobility.</p></div>
      <button class="monitor-switch" role="switch" aria-checked="${changed}" onclick="toggleMonitoringScenario()"><span class="monitor-switch-track"><i></i></span>Reduced mobility ${changed ? 'on' : 'off'}</button>
    </div>
    <div class="monitor-summary" aria-live="polite">
      <article><span>Steps today</span><strong>${changed ? '110' : '460'}<small> / 470 illustrative target</small></strong><p>${changed ? '74% fewer than Day 3' : 'Following the sample recovery trend'}</p></article>
      <article><span>Night awakenings</span><strong>${changed ? '7' : '2'}<small> last night</small></strong><p>${changed ? 'Increased from 3 on Day 3' : 'Consistent with earlier nights'}</p></article>
      <article><span>Time upright</span><strong>${changed ? '74' : '175'}<small> / 180 minutes</small></strong><p>Sample care-plan activity goal</p></article>
    </div>
    <div class="grid g2 monitor-chart-grid">
      <article class="card"><div class="card-h"><span class="ic">${svg(I.walk,2)}</span><h3>Daily mobility</h3><span class="sub">steps</span></div><div class="chart chartwrap" id="monitorSteps"></div><div class="legend"><span><i class="lk" style="background:#df702b"></i>Sample steps</span><span><i class="lk dash"></i>Illustrative target</span></div></article>
      <article class="card"><div class="card-h"><span class="ic">${svg(I.sleep,2)}</span><h3>Sleep interruptions</h3><span class="sub">awakenings / night</span></div><div class="chart chartwrap" id="monitorSleep"></div><p class="monitor-chart-caption">A change in sleep is context for review, not a diagnosis.</p></article>
    </div>
    <div class="grid g2 monitor-detail-grid">
      <article class="card"><div class="card-h"><span class="ic">${svg(I.bell,2)}</span><h3>The caregiver’s observations</h3></div><div class="obs">
      ${changed ? OBS.map(o=>`<div class="obsitem"><span class="oi p-${o.sev==='crit'?'crit':o.sev==='warn'?'warn':'good'}">${svg(I[o.icon]||I.spark,2)}</span><div><div class="ot">${o.t} · ${o.who}</div><p>${o.txt}</p></div></div>`).join('') : `<div class="obsitem"><span class="oi p-good">${svg(I.check,2)}</span><div><div class="ot">Today 10:05 · Maria (aide) · sample</div><p>Completed a short walk with the walker. No new concerns reported in this sample observation.</p></div></div><div class="obsitem"><span class="oi p-good">${svg(I.walk,2)}</span><div><div class="ot">Today 12:30 · Maria (aide) · sample</div><p>Completed the prescribed morning exercises and rested afterward.</p></div></div>`}
      </div></article>
      <article class="card monitor-review"><div class="card-h"><span class="ic">${svg(I.spark,2)}</span><h3>Bring the signals together</h3></div><p class="lead">Compare the sample trends with caregiver observations and the fictional discharge instructions.</p><button class="btn accent" onclick="analyzeMonitoring()">${svg(I.bolt,2)} ${monitoringState.analyzed ? 'Review sample again' : 'Review sample signals'}</button><p class="monitor-demo-note">Scripted demonstration · no live sensors or AI service connected.</p>
      <div id="monitorAnalysis" class="monitor-analysis" aria-live="polite" ${monitoringState.analyzed ? '' : 'hidden'}>${monitoringResult()}</div></article>
    </div>
    ${footer()}
  </section>`;
};

function monitoringResult() {
  return monitoringState.changed
    ? `<div class="alert crit"><span class="ai">${svg(I.flag,2)}</span><div><h4>Nurse review needed in this scenario</h4><p>The fictional caregiver reports new incision redness, warmth, and pain alongside reduced activity and disrupted sleep.</p></div></div><p>These observations match a return precaution in Eleanor’s sample discharge instructions. A licensed clinician reviews the concern and decides the next step.</p><button class="btn prim" onclick="go('clinical')">Prepare nurse review ${svg(I.arrow,2)}</button>`
    : `<div class="alert good"><span class="ai">${svg(I.check,2)}</span><div><h4>No change flagged in this sample</h4><p>The illustrative activity trend and observation log are consistent. Continue the prescribed care plan and record any new concerns.</p></div></div><button class="btn" onclick="go('today')">Open today’s checklist ${svg(I.arrow,2)}</button>`;
}

function toggleMonitoringScenario() {
  monitoringState.changed = !monitoringState.changed;
  monitoringState.analyzed = false;
  renderView();
}

function analyzeMonitoring() {
  monitoringState.analyzed = true;
  const result = document.getElementById('monitorAnalysis');
  result.innerHTML = monitoringResult();
  result.hidden = false;
}

function drawMonitoringCharts() {
  const changed = monitoringState.changed;
  const steps = changed ? [160,250,430,270,110] : [160,250,330,400,460];
  const target = [150,230,310,390,470];
  const sleep = changed ? [2,2,3,5,7] : [2,2,3,2,2];
  function chart(values, maximum, label, bars) {
    const w=480,h=235,left=40,right=20,top=25,bottom=35;
    const x=i=>left+(w-left-right)*i/4;
    const y=v=>top+(h-top-bottom)*(1-v/maximum);
    const grid=[0,maximum/2,maximum].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${w-right}" y2="${y(v)}" stroke="var(--line)"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end" fill="var(--ink-2)" font-size="11">${v}</text>`).join('');
    const ticks=values.map((v,i)=>`<text x="${x(i)}" y="${h-11}" text-anchor="middle" fill="var(--ink-2)" font-size="11">Day ${i+1}</text>`).join('');
    const plot=bars ? values.map((v,i)=>`<rect x="${x(i)-16}" y="${y(v)}" width="32" height="${y(0)-y(v)}" rx="5" fill="${changed&&i>2?'#bf5239':'#df702b'}"/><text x="${x(i)}" y="${y(v)-8}" text-anchor="middle" fill="var(--ink)" font-size="12">${v}</text>`).join('') : `<polyline points="${target.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="var(--ink-3)" stroke-width="2" stroke-dasharray="6 5"/><polyline points="${values.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="#df702b" stroke-width="3"/>${values.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="#df702b" stroke="var(--surface)" stroke-width="2"/><text x="${x(i)}" y="${y(v)-13}" text-anchor="middle" fill="var(--ink)" font-size="12">${v}</text>`).join('')}`;
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}: ${values.join(', ')}</title>${grid}${plot}${ticks}</svg>`;
  }
  const a=document.getElementById('monitorSteps'),b=document.getElementById('monitorSleep');
  if(a) a.innerHTML=chart(steps,500,'Sample daily step count',false);
  if(b) b.innerHTML=chart(sleep,8,'Sample night awakenings',true);
}
