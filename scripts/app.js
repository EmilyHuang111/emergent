// Classic scripts keep this static site usable from both file:// and HTTP.
const VIEWS = {};
const TABS = [
  {id:'overview',label:'Recovery overview',icon:'home'},
  {id:'plan',label:'Discharge plan',icon:'doc'},
  {id:'today',label:'Daily checklist',icon:'check'},
  {id:'monitor',label:'Monitoring',icon:'pulse',alert:true},
  {id:'coord',label:'Care coordination',icon:'link'},
  {id:'clinical',label:'Nurse review',icon:'shield'}
];
let current = 'home';
const HOME_SECTIONS = ['platform','how-it-works','who-we-serve'];
function navigationMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';}
function renderRail(){
  document.getElementById('rail').innerHTML = TABS.map(t=>`<button class="tab" role="tab" id="tab-${t.id}" aria-selected="${t.id===current}" aria-controls="main" tabindex="${t.id===current?0:-1}" onclick="go('${t.id}')">${svg(I[t.icon])} ${t.label}${t.alert?'<span class="dot" aria-label="Demo concern"></span>':''}</button>`).join('');
}
function go(id){
  if(!Object.prototype.hasOwnProperty.call(VIEWS,id)) id='home';
  if(location.hash!=='#'+id){
    try{history.pushState(null,'','#'+id);}catch(e){location.hash=id;}
  }
  current=id;
  renderRail();renderView();
  window.scrollTo({top:0,behavior:navigationMotion()});
  document.getElementById('main').focus({preventScroll:true});
}
function renderView(){
  document.body.dataset.view=current;
  const main=document.getElementById('main');
  main.innerHTML=VIEWS[current]();
  main.setAttribute('role',current==='home'?'main':'tabpanel');
  if(current==='home')main.removeAttribute('aria-labelledby');
  else main.setAttribute('aria-labelledby','tab-'+current);
  document.title=current==='home'?'CareBridge — A stronger recovery at home':TABS.find(t=>t.id===current).label+' · CareBridge demo';
  document.getElementById('workspace-nav').hidden=current==='home';
  document.getElementById('demo-controls').hidden=current==='home';
  document.getElementById('site-nav').hidden=current!=='home';
  if(current==='monitor') drawMonitoringCharts();
  if(current==='plan' && typeof restorePlanState==='function') restorePlanState();
}
function footer(){return `<div class="foot">CareBridge · AI-assisted home recovery · <b>Fictional demonstration.</b> Clinical decisions remain with licensed professionals.</div>`;}
function scrollHomeSection(id){
  if(!HOME_SECTIONS.includes(id))return;
  if(current!=='home')go('home');
  const section=document.getElementById(id);
  if(!section)return;
  section.style.scrollMarginTop=((document.querySelector('.site-header')?.offsetHeight||92)+20)+'px';
  section.scrollIntoView({behavior:navigationMotion()});
}
