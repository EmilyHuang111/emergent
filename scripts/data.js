const PATIENT = {
  name:"Eleanor Whitfield", age:82, sex:"F",
  procedure:"Right total hip replacement", date:"Oct 31, 2026",
  discharged:"Nov 3, 2026", day:5, episode:30,
  nurse:"Dana Osei, RN", pharmacist:"Raj Patel, PharmD",
  pt:"Home PT — Vera Nguyen, DPT", family:"Claire (daughter)", aide:"Maria Santos"
};

const DISCHARGE_TEXT =
`MERCY GENERAL HOSPITAL — DISCHARGE SUMMARY
Patient: Eleanor Whitfield   DOB 03/14/1944 (82 F)   MRN 4471982
Procedure: <b>Right total hip replacement</b> (posterior), 10/31/2026
Discharge 11/03/2026 — Home with home health aide

MEDICATIONS
 • Apixaban 2.5 mg PO BID × 35 days (clot prevention)
 • Acetaminophen 1000 mg PO q8h scheduled × 14 days
 • Oxycodone 5 mg PO q6h PRN severe pain (max 4/day), taper
 • Docusate 100 mg PO BID while on opioid
 • Lisinopril 10 mg PO daily (home)
 • HOLD metformin — reconcile with PCP

ACTIVITY / PRECAUTIONS
 Weight bear as tolerated w/ front-wheeled walker.
 Posterior hip precautions ×6 wks: no flexion >90°,
 no crossing legs, no internal rotation. Raised toilet
 seat. No driving. Ambulate hourly while awake.

REHAB  Home PT 3×/wk. Ankle pumps, glute sets, quad
 sets, seated knee extensions — 10 reps ×3 daily.

WOUND  Keep incision clean/dry. Dressing until 11/06,
 then daily dry dressing. Staples out at follow-up.

DIET  Regular, high-protein, 2 L fluids/day. Glucose BID.

CALL MD IF: fever >100.4°F, rising incision redness /
 drainage / odor, calf pain or swelling, chest pain or
 shortness of breath, uncontrolled pain, fall.

FOLLOW-UP
 • Ortho (Dr. Alvarez) 11/17 10:30 AM — staple removal
 • PCP (Dr. Lin) within 7 days — med reconciliation
 • Home PT eval 11/04`;

const MEDS = [
  {name:"Apixaban",dose:"2.5 mg",freq:"Twice daily",purpose:"Prevents blood clots after surgery",flag:"high",note:"Do not skip — clot risk"},
  {name:"Acetaminophen",dose:"1000 mg",freq:"Every 8 h (scheduled)",purpose:"Baseline pain control",flag:"",note:"Keep on schedule"},
  {name:"Oxycodone",dose:"5 mg",freq:"Every 6 h as needed",purpose:"Severe breakthrough pain",flag:"watch",note:"Max 4/day · taper · track doses"},
  {name:"Docusate",dose:"100 mg",freq:"Twice daily",purpose:"Prevents opioid constipation",flag:"",note:"While on oxycodone"},
  {name:"Lisinopril",dose:"10 mg",freq:"Once daily",purpose:"Blood pressure (home med)",flag:"",note:"Continue as before"},
  {name:"Metformin",dose:"—",freq:"HELD",purpose:"Diabetes — paused after surgery",flag:"crit",note:"⚠ Needs PCP confirmation before restart"}
];

const CHECKLIST = [
  {id:"c1",t:"Morning meds: Apixaban + Acetaminophen + Lisinopril",m:"With breakfast · check off each",time:"8:00",done:true},
  {id:"c2",t:"Ankle pumps, glute & quad sets — 10 reps ×3",m:"Rehab set 1 of 3 · see how-to",time:"9:00",done:true},
  {id:"c3",t:"Short walk with walker to kitchen & back",m:"Encourage hourly movement",time:"10:00",done:true},
  {id:"c4",t:"Check incision: redness, drainage, odor",m:"Photo-log if any change",time:"11:00",done:false},
  {id:"c5",t:"High-protein lunch + 2 glasses water",m:"Track fluids toward 2 L goal",time:"12:30",done:true},
  {id:"c6",t:"Glucose check (diabetes monitoring)",m:"Log reading · metformin still held",time:"13:00",done:false},
  {id:"c7",t:"Afternoon acetaminophen",m:"Scheduled dose",time:"16:00",done:false},
  {id:"c8",t:"Rehab set 2 of 3 + evening walk",m:"Watch for pain with weight-bearing",time:"17:30",done:false},
  {id:"c9",t:"Evening meds: Apixaban + Docusate",m:"With dinner",time:"20:00",done:false},
  {id:"c10",t:"Confirm tomorrow's PT visit, note questions",m:"Home PT 10:00 AM",time:"21:00",done:false}
];

// wearable — recovery days 1..5
const DAYS=["Day 1","Day 2","Day 3","Day 4","Day 5"];
const STEPS=[160,250,430,270,110];          // actual
const STEPS_TARGET=[150,230,310,390,470];    // expected trajectory
const AWAKE=[2,2,3,5,7];                      // night awakenings
const UPRIGHT_TODAY=74, UPRIGHT_GOAL=180;     // minutes upright today

const OBS=[
  {t:"Today 10:05",who:"Maria (aide)",sev:"warn",icon:"walk",txt:"Eleanor winced and held the walker tightly standing up. Took two tries to bear weight on the right leg."},
  {t:"Today 11:20",who:"Maria (aide)",sev:"crit",icon:"wound",txt:"Small area of new redness and warmth about 2 cm around the incision. No drainage yet. She says it 'throbs.'"},
  {t:"Today 13:40",who:"Wearable",sev:"warn",icon:"sleep",txt:"Sleep log: 7 awakenings last night, longest stretch 54 min. Restlessness up vs. prior nights."},
  {t:"Yesterday 18:00",who:"Maria (aide)",sev:"good",icon:"walk",txt:"Completed all three rehab sets. Walked to the porch and back without complaint."}
];

const APPTS=[
  {d:"Nov 09",dd:"Tomorrow",t:"Home PT visit",who:"Vera Nguyen, DPT",tag:"p-prim",tagt:"Confirmed",ic:"PT",col:"var(--primary)"},
  {d:"Nov 13",dd:"Fri",t:"Pharmacist med review (telehealth)",who:"Raj Patel, PharmD",tag:"p-warn",tagt:"Action needed",ic:"Rx",col:"var(--warn)"},
  {d:"Nov 17",dd:"Tue",t:"Orthopedic follow-up — staple removal",who:"Dr. Alvarez",tag:"p-ink",tagt:"Scheduled",ic:"Dr",col:"var(--ink-3)"}
];

