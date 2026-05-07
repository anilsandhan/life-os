// src/components/TaskCard.jsx
import React, { useState } from 'react'
import { AREA_COLOR, PRIO_COLOR } from '../constants'

function PresetPicker({ onPick, onCustom, onClose }) {
  const tm = (h, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); if (d <= Date.now()) d.setDate(d.getDate() + 1); return d.getTime() - Date.now() }
  const presets = [
    ['30 min',  30 * 60000],
    ['1 hour',  60 * 60000],
    ['3 hours', 3 * 60 * 60000],
    ['Eve 6:30', tm(18, 30)],
    ['Tmr 9:30', tm(9, 30) + (new Date().getHours() < 9 ? 0 : 86400000)],
  ]
  return (
    <div style={{ marginTop: 10, padding: '12px', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 8, fontWeight: 800, letterSpacing: 3, color: 'var(--orange)', marginBottom: 8 }}>REMIND ME</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {presets.map(([label, ms]) => (
          <button key={label} onClick={() => onPick(ms)} style={{
            padding: '5px 11px', background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 5, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11
          }}>{label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onCustom} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border2)', borderRadius: 5, color: 'var(--text2)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Custom…</button>
        <button onClick={onClose} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Cancel</button>
      </div>
    </div>
  )
}

export function TaskCard({ task, onToggle, onDelete, onSetNotify, onClearNotify, onOpenDateModal, idx = 0 }) {
  const [showPreset, setShowPreset] = useState(false)
  const hasNotify = task.notifyAt && task.notifyAt > Date.now()
  const ac = AREA_COLOR[task.area] || '#94a3b8'
  const pc = PRIO_COLOR[task.priority]

  return (
    <div className="fade-up" style={{ animationDelay: `${idx * 0.04}s`, padding: '0 14px 7px' }}>
      <div style={{
        padding: '13px 13px 13px 15px', background: 'var(--bg2)',
        border: '1px solid var(--border)', borderLeft: `3px solid ${pc}`,
        borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start',
        boxShadow: '0 2px 12px #00000033',
      }}>
        {/* Checkbox */}
        <div onClick={onToggle} style={{
          width: 18, height: 18, borderRadius: 4, border: `2px solid ${pc}`,
          background: 'transparent', flexShrink: 0, marginTop: 1, cursor: 'pointer',
          transition: 'transform .15s', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
            {task.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            <Badge color={ac}>{task.area.toUpperCase()}</Badge>
            <Badge color={pc}>{task.priority.toUpperCase()}</Badge>
            {hasNotify && (
              <button onClick={onClearNotify} style={{
                fontSize: 9, color: 'var(--yellow)', background: '#1c150015',
                border: '1px solid #facc1540', borderRadius: 3, padding: '2px 7px',
                fontFamily: 'var(--font-mono)', cursor: 'pointer', letterSpacing: 0.5
              }}>
                ⏰ {new Date(task.notifyAt).toLocaleDateString([], {month:'short',day:'numeric'})} {new Date(task.notifyAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} ✕
              </button>
            )}
          </div>
          {showPreset && (
            <PresetPicker
              onPick={ms => { onSetNotify(Date.now() + ms); setShowPreset(false) }}
              onCustom={() => { setShowPreset(false); onOpenDateModal() }}
              onClose={() => setShowPreset(false)}
            />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <ActionBtn color={hasNotify ? 'var(--yellow)' : 'var(--text4)'} borderColor={hasNotify ? '#facc1544' : 'var(--border)'} onClick={() => setShowPreset(v => !v)}>🔔</ActionBtn>
          <ActionBtn color="var(--text4)" borderColor="var(--border)" onClick={onDelete}>✕</ActionBtn>
        </div>
      </div>
    </div>
  )
}

export function DoneCard({ task, onToggle, onDelete }) {
  return (
    <div style={{ padding: '0 14px 5px', opacity: 0.4 }}>
      <div style={{ padding: '10px 13px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div onClick={onToggle} style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--green)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: '#080810', fontWeight: 900 }}>✓</span>
        </div>
        <div style={{ flex: 1, fontFamily: 'var(--font-head)', fontSize: 12, color: 'var(--text3)', textDecoration: 'line-through', lineHeight: 1.4 }}>{task.title}</div>
        <button onClick={onDelete} style={{ color: 'var(--text4)', fontSize: 14, padding: 2 }}>✕</button>
      </div>
    </div>
  )
}

function Badge({ color, children }) {
  return (
    <span style={{ fontSize: 9, fontFamily: 'var(--font-head)', fontWeight: 800, letterSpacing: 1.5, color, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 3, padding: '2px 8px' }}>
      {children}
    </span>
  )
}

function ActionBtn({ color, borderColor, onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'transparent', border: `1px solid ${borderColor}`, borderRadius: 5, padding: '5px 8px', fontSize: 13, color, transition: 'all .15s' }}>
      {children}
    </button>
  )
}
