// src/components/AITab.jsx
import React, { useState, useRef, useEffect } from 'react'
import { askClaude } from '../api/claude'
import { PRIO_COLOR, AREA_COLOR } from '../constants'

const SYSTEM = (tasks) => `You are Anil's personal AI assistant embedded in his Life OS app.

About Anil:
- Sole firmware developer (nRF52/Zephyr/NCS v2.9.0), works remotely from Bhaini Khurd village, Karnal, Haryana
- Wife (DTP office clerk), daughter (age 9, DPS Karnal), son (age 4)
- Gym 7–8:30 AM daily, 6 days/week. Target: 85→83 kg
- Building rental property portfolio in Karnal/Haryana (~₹1L/month rental income target)
- Family trip: Dharamshala/McLeod Ganj June 4–7
- Protects 5–7 PM for family — no work calls in that window
- R&D lead changes firmware requirements mid-project without warning — biggest frustration
- Swing trading system, ₹2L capital, paper trading phase. 17 stocks, ~₹3.9L underwater

Open tasks right now:
${tasks.filter(t=>!t.done).map(t=>`  [${t.area}/${t.priority}] ${t.title}${t.dueDate?' (due '+t.dueDate+')':''}`).join('\n') || '  None — all clear!'}

Overdue tasks:
${tasks.filter(t=>!t.done&&t.dueDate&&new Date(t.dueDate)<new Date()).map(t=>`  ⚠️ ${t.title}`).join('\n') || '  None'}

Be direct and practical — like a sharp friend who knows his life well.
Under 120 words unless asked for more. No filler phrases. Speak plainly.`

const QUICK_PROMPTS = [
  'What should I focus on right now?',
  'Prioritize my open tasks',
  'What am I missing or forgetting?',
  'Quick win I can do in 30 minutes?',
]

export function AITab({ tasks, addToast }) {
  const [history, setHistory]   = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [history])

  async function send(msg) {
    const m = (msg || input).trim()
    if (!m || loading) return
    setInput('')
    setHistory(h => [...h, { role:'user', text:m }])
    setLoading(true)
    try {
      const reply = await askClaude(SYSTEM(tasks), m)
      setHistory(h => [...h, { role:'ai', text:reply }])
    } catch {
      setHistory(h => [...h, { role:'error', text:'Could not reach AI. Check your connection.' }])
    }
    setLoading(false)
  }

  async function getDailyBriefing() {
    setBriefingLoading(true); setBriefing(null)
    const sys = `You are Anil's morning briefing AI. Be extremely concise — 4 bullet points max.
Cover: (1) top priority task today, (2) any overdue items, (3) one quick win, (4) reminder about his protected time (gym 7AM, family 5-7PM).
Format: plain bullet points, no markdown headers, no emojis except one per line, under 80 words total.`
    const openTasks = tasks.filter(t=>!t.done).map(t=>`[${t.area}/${t.priority}] ${t.title}`).join('\n') || 'None'
    try {
      const reply = await askClaude(sys, `Open tasks:\n${openTasks}\n\nGive me my morning briefing.`)
      setBriefing(reply)
    } catch { setBriefing('Could not generate briefing.') }
    setBriefingLoading(false)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Morning briefing card */}
      <div style={{ padding:'10px 14px 0', flexShrink:0 }}>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:'14px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: briefing?10:0 }}>
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:3, color:'var(--yellow)' }}>☀ MORNING BRIEFING</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text4)', marginTop:2 }}>AI summary of your day</div>
            </div>
            <button onClick={getDailyBriefing} disabled={briefingLoading} style={{
              padding:'8px 14px', background:briefingLoading?'var(--bg3)':'#1a1000',
              border:'1px solid var(--yellow)44', borderRadius:8,
              color:'var(--yellow)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:9, letterSpacing:1,
            }}>
              {briefingLoading ? <span className="pulsing">…</span> : 'GENERATE'}
            </button>
          </div>
          {briefing && (
            <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text2)', lineHeight:1.8, paddingTop:8, borderTop:'1px solid var(--border)' }}>
              {briefing}
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {history.length === 0 && (
          <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', marginBottom:8 }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)} style={{
                padding:'7px 12px', background:'var(--bg3)', border:'1px solid var(--border2)',
                borderRadius:20, color:'var(--text2)', fontFamily:'var(--font-mono)', fontSize:11,
                whiteSpace:'nowrap', flexShrink:0,
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:'auto', padding:'6px 14px 8px', display:'flex', flexDirection:'column', gap:10 }}>
        {history.length === 0 && (
          <div style={{ textAlign:'center', padding:'30px 20px' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>◈</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:10, fontWeight:800, letterSpacing:4, color:'var(--text4)' }}>AI ASSISTANT ONLINE</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text4)', marginTop:6, lineHeight:1.7 }}>
              Tap a quick prompt above<br/>or type your own question.
            </div>
          </div>
        )}
        {history.map((m,i) => (
          <div key={i} style={{
            maxWidth:'88%', alignSelf: m.role==='user'?'flex-end':'flex-start',
            padding:'12px 15px',
            borderRadius: m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',
            background: m.role==='user'?'#1e0e00':m.role==='error'?'#1a0808':'var(--bg2)',
            border: m.role==='user'?'1px solid #f9731630':m.role==='error'?'1px solid var(--red)40':'1px solid var(--border)',
            color: m.role==='error'?'var(--red)':'var(--text)',
            fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.65,
          }}>
            {m.role==='ai' && <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:3, color:'var(--orange)', marginBottom:6 }}>◈ LIFE OS AI</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ maxWidth:'60%', padding:'12px 15px', borderRadius:'14px 14px 14px 4px', background:'var(--bg2)', border:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:3, color:'var(--orange)', marginBottom:6 }}>◈ LIFE OS AI</div>
            <div className="pulsing" style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text3)' }}>thinking…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border)', flexShrink:0, paddingBottom:'calc(10px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ display:'flex', gap:8, background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:14, padding:'8px 8px 8px 14px' }}>
          <textarea rows={2} value={input} onChange={e => setInput(e.target.value)}
            placeholder="What's on your mind?"
            onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}
            style={{ flex:1, background:'transparent', border:'none', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.5, outline:'none', paddingTop:2 }} />
          <button onClick={() => send()} disabled={loading||!input.trim()} style={{
            width:44, height:44, background:loading||!input.trim()?'var(--bg3)':'var(--orange)',
            border:'none', borderRadius:10, color:'#fff', fontSize:20, flexShrink:0, alignSelf:'flex-end', transition:'background .15s',
          }}>→</button>
        </div>
      </div>
    </div>
  )
}
