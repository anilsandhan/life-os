// src/components/AITab.jsx
import React, { useState, useRef, useEffect } from 'react'
import { askClaude } from '../api/claude'

const SYSTEM = (tasks) => `You are Anil's personal AI assistant embedded in his Life OS app.

About Anil:
- Sole firmware developer (nRF52/Zephyr/NCS v2.9.0), works remotely from Bhaini Khurd village, Karnal, Haryana
- Wife (DTP office clerk), daughter (age 9, DPS Karnal), son (age 4, DPS Karnal)
- Gym 7–8:30 AM daily (6 days/week), target 85→83 kg
- Building rental property portfolio in Karnal/Haryana (~₹1L/month target)
- Family trip: Dharamshala/McLeod Ganj June 4–7
- Protects 5–7 PM for family — no work in that window
- R&D lead changes requirements mid-project without warning — his biggest frustration

Open tasks right now:
${tasks.filter(t => !t.done).map(t => `  [${t.area}/${t.priority}] ${t.title}`).join('\n') || '  None'}

Be direct and practical — like a sharp friend who knows his life well.
Under 120 words unless he asks for more. No filler.`

export function AITab({ tasks }) {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history])

  async function send() {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    setError(null)
    setHistory(h => [...h, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const reply = await askClaude(SYSTEM(tasks), msg)
      setHistory(h => [...h, { role: 'ai', text: reply }])
    } catch (e) {
      setError('Could not reach AI. Check your API connection.')
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, fontWeight: 800, letterSpacing: 4, color: 'var(--text4)', marginBottom: 8 }}>AI ASSISTANT ONLINE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text4)', lineHeight: 1.7 }}>
              Ask about your tasks, get advice<br />on priorities, or think through a problem.
            </div>
          </div>
        )}
        {history.map((m, i) => (
          <div key={i} style={{
            maxWidth: '86%',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            padding: '12px 15px',
            borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: m.role === 'user' ? '#1e0e00' : 'var(--bg2)',
            border: m.role === 'user' ? '1px solid var(--orange)30' : '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.65,
          }}>
            {m.role === 'ai' && <div style={{ fontFamily: 'var(--font-head)', fontSize: 8, fontWeight: 800, letterSpacing: 3, color: 'var(--orange)', marginBottom: 6 }}>◈ LIFE OS AI</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ maxWidth: '60%', padding: '12px 15px', borderRadius: '14px 14px 14px 4px', background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 8, fontWeight: 800, letterSpacing: 3, color: 'var(--orange)', marginBottom: 6 }}>◈ LIFE OS AI</div>
            <div className="pulsing" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)' }}>thinking…</div>
          </div>
        )}
        {error && (
          <div style={{ padding: '10px 14px', background: '#1a0808', border: '1px solid var(--red)44', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>{error}</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', flexShrink: 0, paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, padding: '8px 8px 8px 14px' }}>
          <textarea rows={2} value={input} onChange={e => setInput(e.target.value)}
            placeholder="What's on your mind?"
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5, outline: 'none', resize: 'none', paddingTop: 2 }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width: 42, height: 42, background: loading || !input.trim() ? 'var(--bg3)' : 'var(--orange)',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 18, flexShrink: 0, alignSelf: 'flex-end', transition: 'background .15s'
          }}>→</button>
        </div>
      </div>
    </div>
  )
}
