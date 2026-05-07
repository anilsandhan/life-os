// src/components/BottomNav.jsx
import React from 'react'
import { NAV_TABS } from '../constants'

export function BottomNav({ tab, setTab }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(7,7,15,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #1e1e32',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      display: 'flex',
    }}>
      {NAV_TABS.map(({ id, icon, label }) => {
        const active = tab === id
        return (
          <button key={id} onClick={() => setTab(id)}
            className={`nav-item${active ? ' active' : ''}`}
            style={{
              flex: 1, padding: '12px 4px 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? 'var(--orange)' : 'var(--text4)',
              position: 'relative', overflow: 'hidden',
            }}>
            {/* Active glow dot */}
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 32, height: 2, borderRadius: '0 0 4px 4px',
                background: 'var(--orange)',
                boxShadow: '0 2px 8px var(--orange)',
              }} />
            )}
            <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 8, letterSpacing: 2 }}>
              {label.toUpperCase()}
            </span>
          </button>
        )
      })}
    </div>
  )
}
