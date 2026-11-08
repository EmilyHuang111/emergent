function setPersona(p){
  document.body.dataset.persona=p;
  document.getElementById('pCare').setAttribute('aria-pressed',p==='caregiver');
  document.getElementById('pClin').setAttribute('aria-pressed',p==='clinician');
  try{localStorage.setItem('cb-persona',p)}catch(e){}
}
function setTheme(t){
  if(t) document.documentElement.setAttribute('data-theme',t); else document.documentElement.removeAttribute('data-theme');
  const dark = t==='dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches);
  document.getElementById('themeIcon').innerHTML = dark
    ? '<path d="M20 14A8 8 0 118 2a6 6 0 0012 12z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  try{t?localStorage.setItem('cb-theme',t):localStorage.removeItem('cb-theme')}catch(e){}
  if(current==='monitor') drawMonitoringCharts();
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const sysDark=matchMedia('(prefers-color-scheme:dark)').matches;
  const now = cur ? cur : (sysDark?'dark':'light');
  setTheme(now==='dark'?'light':'dark');
}

