import React, { useState, useEffect } from 'react'

// ─── Storage helpers ───────────────────────────────────────────────────────────
async function loadData(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null }
  catch { return null }
}
async function saveData(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)) } catch {}
}

const TODAY = new Date().toDateString()

// ─── Daily Rituals config ─────────────────────────────────────────────────────
const RITUALS = [
  { id: 'gym',       sym: '◎', label: 'GYM',          desc: '7:00–8:30 AM · Non-negotiable',            phase: 1, color: '#30b060' },
  { id: 'journal',   sym: '◈', label: 'MORNING LOG',  desc: '6:30 AM · 3 wins, 1 focus, 1 threat',      phase: 1, color: '#4090e0' },
  { id: 'deepwork1', sym: '▸', label: 'DEEP WORK I',  desc: '9:30–11:00 · Firmware block, no Slack',    phase: 1, color: '#e07030' },
  { id: 'deepwork2', sym: '▸', label: 'DEEP WORK II', desc: '11:30–1:00 · Second firmware block',       phase: 1, color: '#e07030' },
  { id: 'walk',      sym: '◉', label: 'MIDDAY WALK',  desc: '1:00 PM · 15 min outdoors minimum',        phase: 1, color: '#30b060' },
  { id: 'homework',  sym: '◉', label: 'HOMEWORK',     desc: '4:00–5:00 PM · Full presence, no laptop',  phase: 1, color: '#c060a0' },
  { id: 'family',    sym: '◉', label: 'FAMILY TIME',  desc: '5:00–7:00 PM · Slack off, non-negotiable', phase: 1, color: '#c060a0' },
  { id: 'braindump', sym: '◈', label: 'BRAIN DUMP',   desc: '9:00 PM · Clear tomorrow\'s tasks',        phase: 1, color: '#4090e0' },
  { id: 'sleep',     sym: '◎', label: 'LIGHTS OUT',   desc: '10:30 PM · Phone out of bedroom',          phase: 1, color: '#8060c0' },
  // Phase 2 additions
  { id: 'premortem', sym: '◆', label: 'PRE-MORTEM',   desc: 'Mon · What could derail this week?',       phase: 2, color: '#e8a020' },
  { id: 'overload',  sym: '◆', label: 'PROG. OVERLOAD',desc: 'Gym · Increase weight or reps on 2 exercises', phase: 2, color: '#30b060' },
  { id: 'eveningwalk',sym:'◉', label: 'EVENING WALK', desc: 'Post-dinner · 20 min family walk',         phase: 2, color: '#c060a0' },
]

// ─── Phases ───────────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: 'p1', label: 'PHASE 01', sub: 'DAYS 1–30', title: 'FOUNDATION',
    tagline: 'Audit · Install · Stabilise',
    goal: 'Replace friction with default systems. No willpower needed by Day 30.',
    color: '#4090e0',
    pillars: [
      { sym: '◎', name: 'MINDSET', items: [
        'Morning audit: 3 wins, 1 focus, 1 threat — written, not typed',
        'Identify biggest recurring distraction and install one hard constraint',
        '5-min evening brain-dump to clear tomorrow\'s cognitive load',
        'Read 15 min/day — one book on execution (start: Atomic Habits)',
      ]},
      { sym: '◈', name: 'PHYSICAL', items: [
        'Gym 7–8:30 AM locked as non-negotiable — already live, protect it',
        'Baseline: log weight every Mon morning, track reps/weight each session',
        'Protein target: bodyweight (kg) × 1.6g daily — track for 4 weeks',
        'Sleep: bed by 10:30 PM, phone out of bedroom, no screens 45 min before',
      ]},
      { sym: '▸', name: 'FIRMWARE', items: [
        'Map all 4 projects to a priority matrix — urgency × complexity',
        '90-min deep-work blocks: 9:30–11, 11:30–1 — no Slack, no interrupts',
        'Start a decision log — every architectural choice gets one-line rationale',
        'Write one lessons-learned note per week on current debug/migration',
      ]},
    ],
    schedule: [
      ['6:30',      'Wake → water → 5-min journal (wins / focus / threat)', true],
      ['7:00–8:30', 'Gym — non-negotiable',                                  true],
      ['8:30–9:30', 'Kids to school, breakfast, transition',                  false],
      ['9:30–11:00','Deep work block 1 — highest-priority firmware only',     true],
      ['11:00–11:30','Slack / email batch — respond, then close',             false],
      ['11:30–1:00','Deep work block 2',                                      true],
      ['1:00–2:00', 'Lunch + 15-min outdoor walk',                           false],
      ['2:00–4:00', 'Meetings, reviews, admin, reactive work',               false],
      ['4:00–5:00', 'Daughter\'s homework — full presence, no laptop',       true],
      ['5:00–7:00', 'Family time — protected, Slack off',                    true],
      ['7:00–8:00', 'Dinner',                                                 false],
      ['8:00–9:00', 'Optional: reading / trading / personal projects',       false],
      ['9:00–9:15', 'Brain-dump tomorrow\'s tasks → 5-min wind-down',       false],
      ['22:30',     'Lights out',                                             true],
    ],
    weekFocus: [
      { day: 'MON',    text: 'Plan the week. Identify the one task that makes everything else easier.' },
      { day: 'TUE–THU',text: 'Maximum deep-work output. Guard both morning blocks fiercely.' },
      { day: 'FRI',    text: 'Review + document. Commit nothing new. Write week\'s lessons-learned.' },
      { day: 'SAT',    text: 'Gym + property/trading admin. One personal project hour.' },
      { day: 'SUN',    text: 'Rest. Family. Prep next week\'s top 3 priorities (10 min only).' },
    ],
    ritualIds: ['gym','journal','deepwork1','deepwork2','walk','homework','family','braindump','sleep'],
  },
  {
    id: 'p2', label: 'PHASE 02', sub: 'DAYS 31–60', title: 'ACCELERATION',
    tagline: 'Load · Compress · Compound',
    goal: 'Systems are stable — now squeeze more output from the same time.',
    color: '#30b060',
    pillars: [
      { sym: '◎', name: 'MINDSET', items: [
        'Add weekly pre-mortem: what could derail this week, what\'s the counter-move?',
        'Replace journal "threat" with "1 assumption I need to test"',
        'Track your energy curve for 2 weeks — note peak focus hours, restructure blocks',
        'One deliberate discomfort per week (cold shower, hard conversation, hard task first)',
      ]},
      { sym: '◈', name: 'PHYSICAL', items: [
        'Progressive overload: increase weight or reps on at least 2 exercises per session',
        'Add one 20-min family walk after dinner — recovery + bonding',
        'Cut one processed item per week, replace with a whole-food equivalent',
        'Monthly weigh-in + waist measure — adjust calories if stalling, not effort',
      ]},
      { sym: '▸', name: 'FIRMWARE', items: [
        'Extend to 3 deep-work blocks if needed — add 2:00–3:30 slot Tue/Thu',
        'Build a personal bug taxonomy — classify every bug into root cause patterns',
        'Pick one SDK/API area per week to go one level deeper than daily work requires',
        'Automate one repetitive dev task (build script, log parser, flash script)',
      ]},
    ],
    schedule: null,
    weekFocus: [
      { day: 'MON',    text: 'Pre-mortem + one-thing identification. Batch all scheduling decisions now.' },
      { day: 'TUE–THU',text: '3-block deep work. Protect ruthlessly. Interruptions = medical emergency.' },
      { day: 'FRI',    text: 'Review, document, publish one internal note or decision log entry.' },
      { day: 'SAT',    text: 'Skill-deepening session (1 hr). Property or trading admin. Gym.' },
      { day: 'SUN',    text: 'Full rest. Dharamshala planning (June). Kids activities.' },
    ],
    ritualIds: ['gym','journal','deepwork1','deepwork2','walk','homework','family','braindump','sleep','premortem','overload','eveningwalk'],
  },
  {
    id: 'p3', label: 'PHASE 03', sub: 'DAYS 61–90', title: 'MASTERY',
    tagline: 'Systematise · Delegate · Scale',
    goal: 'Make your peak your floor. Design the next 90 days from strength.',
    color: '#e8a020',
    pillars: [
      { sym: '◎', name: 'MINDSET', items: [
        'Monthly identity audit: am I acting like the person I want to be in 3 years?',
        'Upgrade reading — move from self-help to primary sources (engineering papers, filings)',
        'Teach one thing per week: explain a firmware concept or write it for a junior dev',
        'Define your ideal week template — the default you protect, not the exception',
      ]},
      { sym: '◈', name: 'PHYSICAL', items: [
        'Target: 83 kg — if reached, shift focus to body composition vs. scale weight',
        'Add structured flexibility block (10 min post-gym) for long-term desk health',
        'Design the minimum viable week — gym routine for high-stress so you never fully stop',
        'Dharamshala June 4–7 as active recovery — hike, walk, sleep, zero work',
      ]},
      { sym: '▸', name: 'FIRMWARE', items: [
        'Document full TinyTag + Smart Hub V3 architecture — forces mastery, creates insurance',
        'Build a firmware runbook — decision trees for failure modes across all 4 projects',
        'Identify where R&D lead\'s mid-sprint changes originate — address it proactively',
        'Pitch one process improvement (async status updates, spec freeze window, etc.)',
      ]},
    ],
    schedule: null,
    weekFocus: [
      { day: 'MON',    text: 'Plan + identity audit. What evidence shows I\'m becoming who I want to be?' },
      { day: 'TUE–THU',text: 'Deep work + architecture documentation. Systems > heroics.' },
      { day: 'FRI',    text: 'Review 90-day progress. Are the numbers moving?' },
      { day: 'SAT',    text: 'Skill or business project. Gym. Kids outdoor activity.' },
      { day: 'SUN',    text: 'Design next 90-day cycle from evidence, not wishful planning.' },
    ],
    ritualIds: ['gym','journal','deepwork1','deepwork2','walk','homework','family','braindump','sleep','premortem','overload','eveningwalk'],
  },
]

const RULES = [
  { sym: '⚡', title: 'NEVER MISS TWICE', desc: 'One missed gym, one skipped review — fine. Two in a row is where habits die. Missing once is an event. Missing twice is the start of a new pattern.' },
  { sym: '✦', title: 'ONE-THING METHOD', desc: 'Each morning, identify the single task that makes the day a success regardless of everything else. Execute it in deep-work block 1 before any communication.' },
  { sym: '◉', title: 'IMPLEMENTATION INTENTIONS', desc: 'Replace "I\'ll work on TinyTag today" with "At 9:30 AM I will open the NCS project and write the BLE scan timeout handler." Specificity eliminates decision overhead.' },
  { sym: '→', title: '2-MINUTE START RULE', desc: 'When you resist starting, commit only to opening the file and writing one line. The act of starting dissolves resistance. Never negotiate with future-you.' },
]

function SLabel({ text, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 0 8px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 4, color: 'var(--muted)' }}>{text}</span>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${color}40,transparent)` }} />
    </div>
  )
}

// ─── Ritual card ──────────────────────────────────────────────────────────────
function RitualCard({ ritual, checked, streak, onToggle }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px',
      background: checked ? `${ritual.color}0f` : 'var(--surface)',
      border: `1px solid ${checked ? ritual.color + '40' : 'var(--rim)'}`,
      borderRadius: 10, marginBottom: 6,
      transition: 'all .2s',
    }}>
      {/* Checkbox */}
      <button onClick={onToggle} style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${checked ? ritual.color : 'var(--muted)'}`,
        background: checked ? ritual.color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .2s',
      }}>
        {checked && <span style={{ fontSize: 12, color: 'var(--deep)', fontWeight: 700 }}>✓</span>}
      </button>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: checked ? ritual.color : 'var(--text)' }}>
            {ritual.label}
          </span>
          {streak >= 2 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1,
              color: streak >= 7 ? '#e8a020' : streak >= 3 ? '#30b060' : 'var(--dim)',
              background: streak >= 7 ? '#e8a02015' : streak >= 3 ? '#30b06015' : 'var(--elevated)',
              border: `1px solid ${streak >= 7 ? '#e8a02040' : streak >= 3 ? '#30b06040' : 'var(--rim)'}`,
              borderRadius: 4, padding: '1px 6px',
            }}>
              {streak >= 7 ? '🔥' : '●'} {streak}d
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--subtle)', letterSpacing: 1 }}>{ritual.desc}</div>
      </div>

      {/* Sym */}
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: checked ? ritual.color : 'var(--muted)', filter: checked ? `drop-shadow(0 0 4px ${ritual.color}80)` : 'none', transition: 'all .2s' }}>{ritual.sym}</span>
    </div>
  )
}

// ─── Main RoadmapTab ──────────────────────────────────────────────────────────
export function RoadmapTab() {
  const [phase, setPhase]           = useState('p1')
  const [view, setView]             = useState('rituals') // 'rituals' | 'plan'
  const [openPillar, setOpenPillar] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showRules, setShowRules]   = useState(false)

  // ritualLog: { [date]: { [ritualId]: true } }
  const [ritualLog, setRitualLog]   = useState({})
  const [loaded, setLoaded]         = useState(false)

  useEffect(() => {
    loadData('lifeos_ritual_log').then(d => {
      if (d) setRitualLog(d)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) saveData('lifeos_ritual_log', ritualLog)
  }, [ritualLog, loaded])

  function toggleRitual(ritualId) {
    setRitualLog(prev => {
      const day = prev[TODAY] || {}
      const updated = { ...prev, [TODAY]: { ...day, [ritualId]: !day[ritualId] } }
      return updated
    })
  }

  // Compute streak for a ritual
  function getStreak(ritualId) {
    let streak = 0
    const d = new Date()
    // Check yesterday and earlier (don't count today — it's in-progress)
    for (let i = 1; i <= 90; i++) {
      d.setDate(d.getDate() - (i === 1 ? 1 : 1))
      const key = d.toDateString()
      if (ritualLog[key]?.[ritualId]) streak++
      else break
    }
    // Also add today if done
    if (ritualLog[TODAY]?.[ritualId]) streak++
    return streak
  }

  const current       = PHASES.find(p => p.id === phase)
  const todayLog      = ritualLog[TODAY] || {}
  const phaseRituals  = RITUALS.filter(r => current.ritualIds.includes(r.id))
  const doneCount     = phaseRituals.filter(r => todayLog[r.id]).length
  const totalCount    = phaseRituals.length
  const pct           = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Phase selector */}
      <div style={{ padding: '10px 14px 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {PHASES.map(p => {
          const active = phase === p.id
          return (
            <button key={p.id} onClick={() => { setPhase(p.id); setOpenPillar(null); setView('rituals') }}
              style={{
                flex: 1, padding: '9px 4px', borderRadius: 10,
                border: `1px solid ${active ? p.color : 'var(--rim)'}`,
                background: active ? `${p.color}15` : 'var(--surface)',
                transition: 'all .2s',
              }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 2, color: active ? p.color : 'var(--dim)', filter: active ? `drop-shadow(0 0 5px ${p.color}60)` : 'none' }}>{p.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: 2, color: active ? p.color : 'var(--muted)', marginTop: 2 }}>{p.sub}</div>
            </button>
          )
        })}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 0, margin: '10px 14px 0', border: '1px solid var(--rim)', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        {[['rituals','◎ TODAY\'S RITUALS'],['plan','◈ 90-DAY PLAN']].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '9px',
            background: view === v ? current.color + '20' : 'transparent',
            borderRight: v === 'rituals' ? '1px solid var(--rim)' : 'none',
            color: view === v ? current.color : 'var(--muted)',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2,
            transition: 'all .2s',
          }}>{label}</button>
        ))}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', paddingBottom: 'calc(var(--nav-h) + 16px)' }}>

        {/* ── RITUALS VIEW ─────────────────────────────────── */}
        {view === 'rituals' && (
          <>
            {/* Today's progress ring + header */}
            <div style={{
              background: 'var(--surface)', border: `1px solid ${current.color}30`,
              borderRadius: 14, padding: '14px 16px', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 14,
              borderLeft: `3px solid ${current.color}`,
            }}>
              {/* Mini ring */}
              <svg width={52} height={52} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                <circle cx={26} cy={26} r={21} fill="none" stroke="var(--rim2)" strokeWidth={3} />
                <circle cx={26} cy={26} r={21} fill="none"
                  stroke={pct === 100 ? '#40c080' : current.color}
                  strokeWidth={3} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 21}
                  strokeDashoffset={2 * Math.PI * 21 * (1 - pct / 100)}
                  style={{ transition: 'stroke-dashoffset .6s ease' }} />
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: current.color, letterSpacing: 3, marginBottom: 3 }}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 3, color: pct === 100 ? '#40c080' : 'var(--bright)', lineHeight: 1 }}>
                  {doneCount}/{totalCount} DONE
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--dim)', marginTop: 3 }}>
                  {pct === 100 ? '🔥 PERFECT DAY' : pct >= 70 ? '▲ STRONG SESSION' : pct >= 40 ? '◆ IN PROGRESS' : '○ GET STARTED'}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: pct === 100 ? '#40c080' : current.color, filter: `drop-shadow(0 0 8px ${current.color}60)` }}>
                {pct}%
              </div>
            </div>

            {/* Ritual cards */}
            {phaseRituals.map(ritual => (
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                checked={!!todayLog[ritual.id]}
                streak={getStreak(ritual.id)}
                onToggle={() => toggleRitual(ritual.id)}
              />
            ))}

            {/* Streak legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--rim)', borderRadius: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: 2 }}>STREAKS</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--dim)' }}>● 2+ days</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#30b060' }}>● 3+ days</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#e8a020' }}>🔥 7+ days</span>
            </div>

            {/* Discipline rules — always at bottom of ritual view */}
            <SLabel text="DISCIPLINE RULES" color={current.color} />
            {RULES.map((rule, i) => (
              <div key={i} style={{ padding: '12px 14px', background: i % 2 === 0 ? 'var(--surface)' : 'var(--deep)', border: '1px solid var(--rim)', borderRadius: i === 0 ? '10px 10px 0 0' : i === RULES.length - 1 ? '0 0 10px 10px' : 0, borderBottom: i < RULES.length - 1 ? 'none' : '1px solid var(--rim)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--signal)' }}>{rule.sym}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--mid)' }}>{rule.title}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.65, paddingLeft: 24 }}>{rule.desc}</div>
              </div>
            ))}
          </>
        )}

        {/* ── PLAN VIEW ────────────────────────────────────── */}
        {view === 'plan' && (
          <>
            {/* Phase header */}
            <div style={{
              background: 'var(--surface)', border: `1px solid ${current.color}30`,
              borderRadius: 14, padding: '16px', marginBottom: 14,
              borderLeft: `3px solid ${current.color}`, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle,${current.color}08,transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: current.color, marginBottom: 4 }}>{current.tagline}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 4, color: 'var(--bright)', lineHeight: 1, marginBottom: 8 }}>{current.title}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>{current.goal}</div>
            </div>

            {/* Pillars */}
            <SLabel text="THREE PILLARS" color={current.color} />
            {current.pillars.map((pillar, i) => (
              <div key={i} style={{ border: '1px solid var(--rim)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                <button onClick={() => setOpenPillar(openPillar === i ? null : i)} style={{
                  width: '100%', background: 'var(--surface)', border: 'none',
                  padding: '13px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', fontFamily: 'var(--font-ui)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: current.color, filter: `drop-shadow(0 0 4px ${current.color}80)` }}>{pillar.sym}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--mid)' }}>{pillar.name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', display: 'inline-block', transform: openPillar === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
                </button>
                {openPillar === i && (
                  <div style={{ background: 'var(--deep)', padding: '4px 0 8px' }}>
                    {pillar.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 12, padding: '9px 16px', borderBottom: j < pillar.items.length - 1 ? '1px solid var(--rim)' : 'none' }}>
                        <span style={{ color: current.color, fontSize: 10, flexShrink: 0, marginTop: 3 }}>→</span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--mid)', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Weekly rhythm */}
            <SLabel text="WEEKLY RHYTHM" color={current.color} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
              {current.weekFocus.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, background: 'var(--surface)', border: '1px solid var(--rim)', borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: current.color, minWidth: 52, flexShrink: 0, marginTop: 1 }}>{w.day}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>{w.text}</span>
                </div>
              ))}
            </div>

            {/* Daily schedule — Phase 1 only */}
            {current.schedule && (
              <>
                <button onClick={() => setShowSchedule(v => !v)} style={{
                  width: '100%', background: 'var(--surface)', border: '1px solid var(--rim)',
                  borderRadius: showSchedule ? '10px 10px 0 0' : 10, padding: '12px 16px', marginBottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--mid)' }}>DAILY SCHEDULE TEMPLATE</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', display: 'inline-block', transform: showSchedule ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
                </button>
                {showSchedule && (
                  <div style={{ border: '1px solid var(--rim)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', marginBottom: 14 }}>
                    {current.schedule.map(([time, action, highlight], i, arr) => (
                      <div key={i} style={{
                        display: 'flex', gap: 12, padding: '8px 14px',
                        background: highlight ? 'var(--surface)' : 'var(--deep)',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--rim)' : 'none',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: highlight ? current.color : 'var(--muted)', minWidth: 60, flexShrink: 0 }}>{time}</span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: highlight ? 'var(--text)' : 'var(--dim)', lineHeight: 1.5 }}>{action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
