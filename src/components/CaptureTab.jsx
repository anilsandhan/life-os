// src/components/CaptureTab.jsx
import React, { useState } from 'react'
import { askClaude } from '../api/claude'
import { AREA_COLOR, PRIO_COLOR } from '../constants'

const SYS = `Extract actionable tasks from a brain dump. Return ONLY valid JSON, no markdown fences, no explanation.
{"tasks":[{"title":"verb-first concise action","area":"Work|Property|Family|Home|Health|Finance|Other","priority":"high|medium|low"}]}
Rules: max 6 tasks, title must start with a verb, infer area and priority from context.`

export function CaptureTab({ onImport }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function extract() {
    if (!text.trim() || loading) return
    setLoading(true); setResult(null); setError(null)
    try {
      const raw = await askClaude(SYS, text.trim())
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setResult(parsed.tasks || [])
    } catch {
      setError('Could not parse tasks. Try rephrasing your dump.')
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800, letterSpacing: 5, color: 'var(--orange)', marginBottom: 4 }}>⬡ BRAIN DUMP</div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>AI extracts<br />your tasks</div>
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={"Dump everything here...\n\nE.g.: R&D lead wants TinyTag shipped but BLE tests aren't done. Need to call Nexa Solar about the 8KW quote and confirm subsidy. Daughter's project due Friday. Book Dharamshala hotel before prices go up."}
        style={{
          width: '100%', minHeight: 140, background: 'var(--bg2)',
          border: '1px solid var(--border2)', borderRadius: 10,
          padding: '14px', color: 'var(--text)', fontSize: 13, lineHeight: 1.7,
          outline: 'none', display: 'block'
        }} />

      <button onClick={extract} disabled={loading || !text.trim()} style={{
        marginTop: 10, width: '100%', padding: 14, background: loading ? 'var(--bg3)' : 'var(--bg2)',
        border: `1px solid ${loading ? 'var(--border)' : 'var(--orange)'}`,
        borderRadius: 10, color: loading ? 'var(--text3)' : 'var(--orange)',
        fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 10, letterSpacing: 3, transition: 'all .15s'
      }}>
        {loading ? '⬡ EXTRACTING…' : '⬡ EXTRACT TASKS WITH AI'}
      </button>

      {error && (
        <div style={{ marginTop: 10, padding: '10px 14px', background: '#1a0808', border: '1px solid var(--red)44', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>{error}</div>
      )}

      {result !== null && result.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'var(--font-head)', fontSize: 10, letterSpacing: 3, color: 'var(--text4)' }}>NO TASKS FOUND · TRY MORE DETAIL</div>
      )}

      {result && result.length > 0 && (
        <>
          <div style={{ padding: '14px 0 8px', fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800, letterSpacing: 4, color: 'var(--text4)' }}>
            EXTRACTED · {result.length} TASKS
          </div>
          {result.map((t, i) => (
            <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.06}s`, marginBottom: 7, padding: '12px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: `3px solid ${PRIO_COLOR[t.priority] || PRIO_COLOR.medium}`, borderRadius: 9, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{t.title}</div>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-head)', fontWeight: 800, letterSpacing: 1.5, color: AREA_COLOR[t.area] || '#94a3b8', background: `${AREA_COLOR[t.area] || '#94a3b8'}15`, border: `1px solid ${AREA_COLOR[t.area] || '#94a3b8'}40`, borderRadius: 3, padding: '2px 8px', flexShrink: 0 }}>
                {(t.area || 'Other').toUpperCase()}
              </span>
            </div>
          ))}
          <button onClick={() => { onImport(result); setResult(null); setText('') }} style={{
            width: '100%', padding: 14, background: 'var(--orange)', border: 'none',
            borderRadius: 10, color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 800,
            fontSize: 11, letterSpacing: 2, marginTop: 4
          }}>
            IMPORT ALL → TASKS
          </button>
        </>
      )}
    </div>
  )
}
