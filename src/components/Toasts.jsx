// src/components/Toasts.jsx
import React from 'react'

export function Toasts({ toasts, remove }) {
  return (
    <div style={{
      position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
      right: 12, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
      maxWidth: 320, width: 'calc(100vw - 24px)', pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} className={t.exiting ? 'toast-out' : 'toast-in'}
          style={{
            pointerEvents: 'all',
            background: '#0e0e1c',
            border: `1px solid ${t.color}55`,
            borderLeft: `4px solid ${t.color}`,
            borderRadius: 10,
            padding: '13px 14px',
            display: 'flex', gap: 11, alignItems: 'flex-start',
            boxShadow: `0 12px 36px #00000088, 0 0 0 1px ${t.color}11`,
          }}>
          <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{t.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, color: t.color, letterSpacing: 2, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{t.body}</div>
          </div>
          <button onClick={() => remove(t.id)} style={{ color: 'var(--text4)', fontSize: 16, lineHeight: 1, padding: 2, flexShrink: 0 }}>✕</button>
        </div>
      ))}
    </div>
  )
}
