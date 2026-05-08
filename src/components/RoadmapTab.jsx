import React, { useState } from 'react'

const PHASES = [
  {
    id: 'p1', label: 'PHASE 01', sub: 'DAYS 1–30', title: 'FOUNDATION',
    tagline: 'Audit · Install · Stabilise',
    goal: 'Replace friction with default systems. No willpower needed by Day 30.',
    color: '#4090e0',
    pillars: [
      { sym: '◎', name: 'MINDSET', items: [
        'Morning audit: 3 wins, 1 focus, 1 threat — written, not typed',
        'Identify biggest recurring distraction and install one hard constraint on it',
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
      ['6:30', 'Wake → water → 5-min journal (wins / focus / threat)', true],
      ['7:00–8:30', 'Gym — non-negotiable', true],
      ['8:30–9:30', 'Kids to school, breakfast, transition', false],
      ['9:30–11:00', 'Deep work block 1 — highest-priority firmware only', true],
      ['11:00–11:30', 'Slack / email batch — respond, then close', false],
      ['11:30–1:00', 'Deep work block 2', true],
      ['1:00–2:00', 'Lunch + 15-min outdoor walk', false],
      ['2:00–4:00', 'Meetings, reviews, admin, reactive work', false],
      ['4:00–5:00', 'Daughter\'s homework — full presence, no laptop', true],
      ['5:00–7:00', 'Family time — protected, Slack off', true],
      ['7:00–8:00', 'Dinner', false],
      ['8:00–9:00', 'Optional: reading / trading / personal projects', false],
      ['9:00–9:15', 'Brain-dump tomorrow\'s tasks → 5-min wind-down', false],
      ['22:30', 'Lights out', true],
    ],
    weekFocus: [
      { day: 'MON', text: 'Plan the week. Identify the one task that makes everything else easier.' },
      { day: 'TUE–THU', text: 'Maximum deep-work output. Guard both morning blocks fiercely.' },
      { day: 'FRI', text: 'Review + document. Commit nothing new. Write week\'s lessons-learned.' },
      { day: 'SAT', text: 'Gym + property/trading admin. One personal project hour.' },
      { day: 'SUN', text: 'Rest. Family. Prep next week\'s top 3 priorities (10 min only).' },
    ],
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
      { day: 'MON', text: 'Pre-mortem + one-thing identification. Batch all scheduling decisions now.' },
      { day: 'TUE–THU', text: '3-block deep work. Protect ruthlessly. Interruptions = medical emergency.' },
      { day: 'FRI', text: 'Review, document, publish one internal note or decision log entry.' },
      { day: 'SAT', text: 'Skill-deepening session (1 hr). Property or trading admin. Gym.' },
      { day: 'SUN', text: 'Full rest. Dharamshala planning (June). Kids activities.' },
    ],
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
        'Design the minimum viable week — gym routine for high-stress periods so you never stop',
        'Dharamshala June 4–7 as active recovery — hike, walk, sleep, zero work',
      ]},
      { sym: '▸', name: 'FIRMWARE', items: [
        'Document full TinyTag + Smart Hub V3 architecture — forces mastery, creates insurance',
        'Build a firmware runbook — decision trees for common failure modes across all 4 projects',
        'Identify where R&D lead\'s mid-sprint changes originate — address it proactively',
        'Pitch one process improvement (async status updates, spec freeze window, etc.)',
      ]},
    ],
    schedule: null,
    weekFocus: [
      { day: 'MON', text: 'Plan + identity audit. What evidence shows I\'m becoming who I want to be?' },
      { day: 'TUE–THU', text: 'Deep work + architecture documentation. Systems > heroics.' },
      { day: 'FRI', text: 'Review 90-day progress. Are the numbers moving?' },
      { day: 'SAT', text: 'Skill or business project. Gym. Kids outdoor activity.' },
      { day: 'SUN', text: 'Design next 90-day cycle from evidence, not wishful planning.' },
    ],
  },
]

const RULES = [
  { sym: '⚡', title: 'NEVER MISS TWICE', desc: 'One missed gym, one skipped review — fine. Two in a row is where habits die. Missing once is an event. Missing twice is the start of a new pattern.' },
  { sym: '✦', title: 'ONE-THING METHOD', desc: 'Each morning, identify the single task that makes the day a success regardless of everything else. Execute it in deep-work block 1 before any communication.' },
  { sym: '◉', title: 'IMPLEMENTATION INTENTIONS', desc: 'Replace "I\'ll work on TinyTag today" with "At 9:30 AM I will open the NCS project and write the BLE scan timeout handler." Specificity eliminates the decision overhead that fuels procrastination.' },
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

function Pillar({ pillar, color, open, onToggle }) {
  return (
    <div style={{ border: '1px solid var(--rim)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'var(--surface)', border: 'none',
        padding: '13px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', fontFamily: 'var(--font-ui)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color, filter: `drop-shadow(0 0 4px ${color}80)` }}>{pillar.sym}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--mid)' }}>{pillar.name}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {open && (
        <div style={{ background: 'var(--deep)', padding: '4px 0 8px' }}>
          {pillar.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 16px', borderBottom: i < pillar.items.length - 1 ? '1px solid var(--rim)' : 'none' }}>
              <span style={{ color, fontSize: 10, flexShrink: 0, marginTop: 3 }}>→</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--mid)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function RoadmapTab() {
  const [phase, setPhase] = useState('p1')
  const [openPillar, setOpenPillar] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const current = PHASES.find(p => p.id === phase)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(var(--nav-h) + 16px)' }}>

      {/* Phase selector */}
      <div style={{ padding: '12px 14px 0', display: 'flex', gap: 6 }}>
        {PHASES.map(p => {
          const active = phase === p.id
          return (
            <button key={p.id} onClick={() => { setPhase(p.id); setOpenPillar(null); setShowSchedule(false) }}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 10,
                border: `1px solid ${active ? p.color : 'var(--rim)'}`,
                background: active ? `${p.color}15` : 'var(--surface)',
                transition: 'all .2s',
              }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 2, color: active ? p.color : 'var(--dim)', filter: active ? `drop-shadow(0 0 6px ${p.color}60)` : 'none' }}>{p.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2, color: active ? p.color : 'var(--muted)', marginTop: 3 }}>{p.sub}</div>
            </button>
          )
        })}
      </div>

      <div style={{ padding: '14px 14px 0' }}>

        {/* Phase header */}
        <div style={{
          background: 'var(--surface)', border: `1px solid ${current.color}30`,
          borderRadius: 14, padding: '16px', marginBottom: 16,
          borderLeft: `3px solid ${current.color}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle,${current.color}08,transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: current.color, marginBottom: 4 }}>{current.tagline}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 4, color: 'var(--bright)', lineHeight: 1, marginBottom: 8 }}>{current.title}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>{current.goal}</div>
        </div>

        {/* Pillars */}
        <SLabel text="THREE PILLARS" color={current.color} />
        {current.pillars.map((pillar, i) => (
          <Pillar key={i} pillar={pillar} color={current.color}
            open={openPillar === i}
            onToggle={() => setOpenPillar(openPillar === i ? null : i)} />
        ))}

        {/* Weekly rhythm */}
        <SLabel text="WEEKLY RHYTHM" color={current.color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
          {current.weekFocus.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, background: 'var(--surface)', border: '1px solid var(--rim)', borderRadius: 8, padding: '10px 14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: current.color, minWidth: 48, flexShrink: 0, marginTop: 1 }}>{w.day}</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.5 }}>{w.text}</span>
            </div>
          ))}
        </div>

        {/* Daily schedule (Phase 1 only — collapsible) */}
        {current.schedule && (
          <>
            <button onClick={() => setShowSchedule(v => !v)} style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--rim)',
              borderRadius: 10, padding: '12px 16px', marginBottom: showSchedule ? 0 : 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--mid)' }}>DAILY SCHEDULE TEMPLATE</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', display: 'inline-block', transform: showSchedule ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
            </button>
            {showSchedule && (
              <div style={{ border: '1px solid var(--rim)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', marginBottom: 16 }}>
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

        {/* Discipline rules — collapsible, always visible */}
        <button onClick={() => setShowRules(v => !v)} style={{
          width: '100%', background: 'var(--surface)', border: '1px solid var(--rim)',
          borderRadius: 10, padding: '12px 16px', marginBottom: showRules ? 0 : 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--mid)' }}>DISCIPLINE RULES</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', display: 'inline-block', transform: showRules ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
        </button>
        {showRules && (
          <div style={{ border: '1px solid var(--rim)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', marginBottom: 16 }}>
            {RULES.map((rule, i) => (
              <div key={i} style={{ padding: '14px', background: i % 2 === 0 ? 'var(--deep)' : 'var(--surface)', borderBottom: i < RULES.length - 1 ? '1px solid var(--rim)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--signal)' }}>{rule.sym}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--mid)' }}>{rule.title}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--dim)', lineHeight: 1.65, paddingLeft: 24 }}>{rule.desc}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
