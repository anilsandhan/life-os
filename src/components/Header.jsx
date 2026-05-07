// src/components/Header.jsx
import React from 'react'
import { FIXED_REMINDERS } from '../constants'

export function Header({ total, done, tab, setTab, remindersOn, setRemindersOn }) {
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Safe area top padding */}
      <div style={{ height: 'env(safe-area-inset-top, 0px)', background: 'var(--bg)' }} />

      {/* Title row */}
      <div style={{ padding: '16px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800, letterSpacing: 5, color: 'var(--orange)', marginBottom: 5 }}>
            ⬡ COMMAND CENTER
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1, letterSpacing: -0.5 }}>
            Life OS
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, lineHeight: 1, color: pct === 100 ? 'var(--green)' : 'var(--orange)' }}>
            {pct}<span style={{ fontSize: 12, color: 'var(--text4)' }}>%</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text4)', letterSpacing: 2, marginTop: 2 }}>{done}/{total} DONE</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--orange), var(--yellow))', transition: 'width .6s ease', borderRadius: 2 }} />
      </div>

      {/* Daily reminders strip */}
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 8, fontWeight: 800, letterSpacing: 3, color: 'var(--text4)', flexShrink: 0 }}>DAILY</span>
        {FIXED_REMINDERS.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>{r.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 800, color: r.color }}>{r.label}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 8, color: 'var(--text4)', letterSpacing: 0.5 }}>
                {r.id === 'gym' ? 'Gym' : r.id === 'work' ? 'Work' : 'Family'}
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => setRemindersOn(v => !v)} style={{
          marginLeft: 'auto', padding: '5px 10px', flexShrink: 0, borderRadius: 5,
          background: remindersOn ? '#0a1a0a' : '#1a0a0a',
          border: `1px solid ${remindersOn ? '#4ade8044' : '#ef444444'}`,
          color: remindersOn ? 'var(--green)' : 'var(--red)',
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 8, letterSpacing: 2
        }}>
          {remindersOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex' }}>
        {[['tasks', '✓ TASKS'], ['ai', '◈ AI CHAT'], ['capture', '⬡ CAPTURE']].map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '13px 4px 11px',
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 10, letterSpacing: 1.5,
            color: tab === k ? 'var(--text)' : 'var(--text3)',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === k ? 'var(--orange)' : 'transparent'}`,
            transition: 'color .15s, border-color .15s',
          }}>
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
