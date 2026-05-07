// src/constants.js

export const AREAS = ['All','Work','Property','Family','Home','Health','Finance','Other']

export const AREA_COLOR = {
  Work:     '#f97316',
  Property: '#38bdf8',
  Family:   '#f472b6',
  Home:     '#a78bfa',
  Health:   '#4ade80',
  Finance:  '#facc15',
  Other:    '#94a3b8',
}

export const AREA_ICON = {
  Work: '💻', Property: '🏗️', Family: '👨‍👩‍👧‍👦',
  Home: '🏠', Health: '💪', Finance: '📈', Other: '📌',
}

export const PRIO_COLOR = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#4ade80',
}

export const FIXED_REMINDERS = [
  { id: 'gym',      hour: 7,  min: 0,  icon: '💪', label: '7:00 AM',  title: 'GYM TIME',    body: "7:00 AM — Get moving. No excuses.",         color: '#4ade80' },
  { id: 'work',     hour: 9,  min: 30, icon: '💻', label: '9:30 AM',  title: 'WORK START',  body: "9:30 AM — Laptop open. Clear the backlog.",  color: '#f97316' },
  { id: 'personal', hour: 18, min: 30, icon: '🏠', label: '6:30 PM',  title: 'FAMILY TIME', body: "6:30 PM — Laptop closed. Kids first.",        color: '#f472b6' },
]

export const SEED_TASKS = [
  { id: 1, title: 'Compare Nexa Solar vs Adani — inverter warranty & brand spec', area: 'Property', priority: 'high',   done: false, ts: Date.now() - 172800000, notifyAt: null },
  { id: 2, title: 'Ship TinyTag firmware + V2 Hub to R&D lead',                   area: 'Work',     priority: 'high',   done: false, ts: Date.now() - 86400000,  notifyAt: null },
  { id: 3, title: 'Share plug-monitor data for Daikin vs old AC comparison',       area: 'Home',     priority: 'medium', done: false, ts: Date.now() - 43200000,  notifyAt: null },
  { id: 4, title: 'Book Dharamshala accommodation — June 4–7',                    area: 'Family',   priority: 'medium', done: false, ts: Date.now() - 21600000,  notifyAt: null },
  { id: 5, title: 'File PM Surya Ghar subsidy documents',                         area: 'Property', priority: 'medium', done: false, ts: Date.now() - 10800000,  notifyAt: null },
  { id: 6, title: 'Gym — 7:00 AM sharp, no excuses',                              area: 'Health',   priority: 'low',    done: false, ts: Date.now() - 3600000,   notifyAt: null },
]
