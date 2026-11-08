// Run after every component has registered its view.
(function(){
  let persona='caregiver',theme='light';
  try{persona=localStorage.getItem('cb-persona')||persona;theme=localStorage.getItem('cb-theme')||theme}catch(e){}
  setPersona(persona==='clinician'?'clinician':'caregiver');
  setTheme(theme==='dark'?'dark':'light');
  const route=location.hash.slice(1);
  current=Object.prototype.hasOwnProperty.call(VIEWS,route)?route:'home';
  renderRail();renderView();
  if(HOME_SECTIONS.includes(route))scrollHomeSection(route);
  function restoreRoute(){
    const id=location.hash.slice(1);
    // A skip-to-content fragment is a document anchor, not a workspace route.
    if(id==='main')return;
    const next=Object.prototype.hasOwnProperty.call(VIEWS,id)?id:'home';
    if(next!==current){current=next;renderRail();renderView();document.getElementById('main').focus({preventScroll:true});}
    if(HOME_SECTIONS.includes(id))scrollHomeSection(id);
  }
  window.addEventListener('hashchange',restoreRoute);
  window.addEventListener('popstate',restoreRoute);
  document.getElementById('rail').addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    let i=TABS.findIndex(t=>t.id===current);
    i=event.key==='Home'?0:event.key==='End'?TABS.length-1:(i+(event.key==='ArrowRight'?1:-1)+TABS.length)%TABS.length;
    go(TABS[i].id);document.getElementById('tab-'+current).focus();
  });
})();
