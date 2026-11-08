"""Check static assets and exercise demo state with macOS JavaScriptCore.

This is a logic smoke check, not a browser rendering test.
"""
from pathlib import Path
import json
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
JSC = shutil.which('jsc') or '/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc'
source = (ROOT / 'index.html').read_text()
scripts = re.findall(r'<script src="([^"]+)"', source)
for entry in ('index.html', 'carebridge.html'):
    for asset in re.findall(r'(?:src|href)="([^"]+)"', (ROOT / entry).read_text()):
        if not asset.startswith(('http', '#')):
            assert (ROOT / asset).is_file(), f'Missing asset: {asset}'
for script in scripts:
    subprocess.run([JSC, '-e', 'new Function(' + json.dumps((ROOT / script).read_text()) + ');'], check=True)

stub = r'''
const nodes = new Map();
function element(id){
  if(!nodes.has(id)) nodes.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,style:{},dataset:{},offsetHeight:92,
    classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this[k]=String(v)},removeAttribute(k){delete this[k]},
    focus(){},scrollIntoView(){},addEventListener(){},querySelector(){return element('query')},appendChild(){},click(){},remove(){}});
  return nodes.get(id);
}
const document={body:element('body'),documentElement:element('root'),getElementById:element,
 querySelector:element,querySelectorAll(){return []},createElement:element};
const location={hash:''};
const history={pushState(a,b,hash){location.hash=hash}};
const window={scrollTo(){},addEventListener(){}};
function storage(){const data={};return {getItem(k){return data[k]||null},setItem(k,v){data[k]=v},removeItem(k){delete data[k]}}}
const localStorage=storage(),sessionStorage=storage();
const matchMedia=()=>({matches:false});
function assert(ok,message){if(!ok)throw Error(message)}
'''
checks = r'''
for(const id of ['home','overview','plan','today','monitor','coord','clinical']){
 go(id);const html=element('main').innerHTML;
 assert(html.length>800,'Missing view '+id);
 assert(!html.includes('undefined'),'Undefined output '+id);
 for(const m of html.matchAll(/on(?:click|input|change)="([^"]+)"/g))new Function(m[1]);
}
go('plan');planGenerate();assert(planState.ready,'Sample plan generation');
planUpdate('MEDICATION: <script>alert(1)</script> once daily');planGenerate();
assert(!element('main').innerHTML.includes('<script>alert(1)</script>'),'Uploaded text must be escaped');
assert(element('main').innerHTML.includes('&lt;script&gt;'),'Escaped custom instructions');
planReset();assert(!planState.ready,'Reset plan');
go('today');const before=CHECKLIST.filter(c=>c.done).length;
dailyToggle('c4',true);assert(CHECKLIST.filter(c=>c.done).length===before+1,'Complete task');
go('overview');assert(element('main').innerHTML.includes('50%'),'Overview shares progress');
go('monitor');analyzeMonitoring();assert(monitoringState.analyzed,'Review monitoring');
go('clinical');createClinicalDraft();assert(clinicalDraftText().includes('110'),'Changed scenario draft');
toggleMonitoringScenario();go('clinical');assert(clinicalState.draft===null,'Invalidate old scenario draft');
createClinicalDraft();assert(clinicalDraftText().includes('460'),'Updated scenario draft');
setPersona('caregiver');acknowledgeClinicalDraft();assert(!clinicalState.acknowledged,'Caregiver cannot acknowledge nurse review');
setPersona('clinician');acknowledgeClinicalDraft();assert(clinicalState.acknowledged,'Demo nurse review');
go('coord');assert(coordDefaultUpdate().includes('460'),'Family update follows scenario');
element('coord-question').value='<img src=x onerror=alert(1)>';coordAddQuestion();
assert(element('main').innerHTML.includes('&lt;img'),'Medication question escaped');
coordConfirm(1);assert(coordinationState.confirmed.has(1),'Appointment confirmation');
go('not-a-route');assert(current==='home','Unknown routes return home');
print('PASS: 7 views, plan generation/escaping, checklist, scenarios, clinical review, coordination, routing.');
'''
combined = stub + '\n' + '\n'.join((ROOT / name).read_text() for name in scripts) + '\n' + checks
with tempfile.TemporaryDirectory(prefix='carebridge-check-') as temp:
    path = Path(temp) / 'check.js'
    path.write_text(combined)
    subprocess.run([JSC, str(path)], check=True)
print(f'PASS: {len(scripts)} script syntax checks and both entrypoints’ asset references.')
