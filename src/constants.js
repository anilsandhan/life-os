export const AREAS = ['All','Work','Property','Family','Home','Health','Finance','Other']

export const AREA_COLOR = {
  Work:'#e07030', Property:'#3090c0', Family:'#c060a0',
  Home:'#8060c0', Health:'#30b060', Finance:'#c0a030', Other:'#607080',
}
export const AREA_ICON = {
  Work:'▸', Property:'◈', Family:'◉', Home:'⬡', Health:'◎', Finance:'◆', Other:'·',
}
export const PRIO_COLOR = { high:'#e05050', medium:'#e0a030', low:'#40c080' }
export const PRIO_LABEL = { high:'CRITICAL', medium:'NORMAL', low:'LOW' }

export const FIXED_REMINDERS = [
  { id:'gym',  hour:7,  min:0,  icon:'◎', label:'07:00', title:'GYM',         body:'Station one. Move the body. No negotiation.',  color:'#30b060' },
  { id:'work', hour:9,  min:30, icon:'▸', label:'09:30', title:'WORK START',  body:'Laptop open. Backlog visible. Begin.',          color:'#e07030' },
  { id:'fam',  hour:18, min:30, icon:'◉', label:'18:30', title:'FAMILY',      body:'Screen down. Kids first. Non-negotiable.',      color:'#c060a0' },
]

export const NAV_TABS = [
  { id:'tasks',   sym:'✦', label:'OPS'     },
  { id:'journal', sym:'◈', label:'LOG'     },
  { id:'ai',      sym:'◎', label:'INTEL'   },
  { id:'stats',   sym:'▲', label:'BRIEF'   },
  { id:'capture', sym:'⬡', label:'INTAKE'  },
]

export const SEED_TASKS = [
  { id:1, title:'Compare Nexa Solar vs Adani — inverter warranty & brand spec', area:'Property', priority:'high',   done:false, ts:Date.now()-172800000, notifyAt:null, note:'Check 8KW option. Subsidy via PM Surya Ghar.', recurring:null, dueDate:null },
  { id:2, title:'Ship TinyTag firmware + V2 Hub to R&D lead',                   area:'Work',     priority:'high',   done:false, ts:Date.now()-86400000,  notifyAt:null, note:'BLE scan fix complete. Final smoke test pending.', recurring:null, dueDate:null },
  { id:3, title:'Share Daikin plug-monitor data for energy comparison',          area:'Home',     priority:'medium', done:false, ts:Date.now()-43200000,  notifyAt:null, note:'', recurring:null, dueDate:null },
  { id:4, title:'Book Dharamshala accommodation — June 4–7',                    area:'Family',   priority:'medium', done:false, ts:Date.now()-21600000,  notifyAt:null, note:'McLeod Ganj preferred. Budget ₹4–5K/night.', recurring:null, dueDate:'2026-05-20' },
  { id:5, title:'File PM Surya Ghar subsidy documents',                         area:'Property', priority:'medium', done:false, ts:Date.now()-10800000,  notifyAt:null, note:'', recurring:null, dueDate:null },
  { id:6, title:'Gym — 7:00 AM',                                                area:'Health',   priority:'low',    done:false, ts:Date.now()-3600000,   notifyAt:null, note:'', recurring:'daily', dueDate:null },
]

// Override NAV_TABS to include capture
// (already defined above — this is handled in constants)
