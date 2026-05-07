// src/components/Header.jsx
import React from 'react'
import { FIXED_REMINDERS } from '../constants'

export function Header({ total, done, remindersOn, setRemindersOn }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const circumference = 2 * Math.PI * 20
  const offset = circumference - (pct / 100) * circumference

  return (
    <div style={{ background:'var(--bg)', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
      <div style={{ height:'env(safe-area-inset-top, 0px)' }} />

      {/* Title + ring */}
      <div style={{ padding:'14px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:5, color:'var(--orange)', marginBottom:4 }}>
            ⬡ COMMAND CENTER
          </div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:24, fontWeight:800, color:'var(--text)', lineHeight:1, letterSpacing:-0.5 }}>
            Life OS
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)', marginTop:3 }}>
            {done}/{total} tasks done today
          </div>
        </div>

        {/* SVG Progress Ring */}
        <div style={{ position:'relative', width:56, height:56 }}>
          <svg width="56" height="56" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="28" cy="28" r="20" fill="none" stroke="var(--border2)" strokeWidth="3" />
            <circle cx="28" cy="28" r="20" fill="none"
              stroke={pct === 100 ? 'var(--green)' : 'var(--orange)'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition:'stroke-dashoffset .6s ease, stroke .3s ease' }}
            />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, color:pct===100?'var(--green)':'var(--text)' }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:'var(--border)' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--orange),var(--yellow))', transition:'width .6s ease' }} />
      </div>

      {/* Daily reminder pills */}
      <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:6, overflowX:'auto', scrollbarWidth:'none' }}>
        {FIXED_REMINDERS.map(r => (
          <div key={r.id} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', background:`${r.color}12`, border:`1px solid ${r.color}30`, borderRadius:20, flexShrink:0 }}>
            <span style={{ fontSize:12 }}>{r.icon}</span>
            <span style={{ fontFamily:'var(--font-head)', fontSize:10, fontWeight:800, color:r.color }}>{r.label}</span>
          </div>
        ))}
        <button onClick={() => setRemindersOn(v => !v)} style={{
          marginLeft:'auto', padding:'5px 12px', borderRadius:20, flexShrink:0,
          background: remindersOn ? '#0a1a0a' : '#1a0a0a',
          border:`1px solid ${remindersOn ? '#4ade8055' : '#ef444455'}`,
          color: remindersOn ? 'var(--green)' : 'var(--red)',
          fontFamily:'var(--font-head)', fontWeight:800, fontSize:8, letterSpacing:2,
        }}>{remindersOn ? '● ON' : '○ OFF'}</button>
      </div>
    </div>
  )
}
