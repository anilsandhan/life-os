import React, { useState, useRef, useEffect } from 'react'
import { askClaude } from '../api/claude'

const SYSTEM = (tasks, entries) => `You are the AI core of Anil's personal Command Center — a high-performance life OS.

About Anil:
- Sole firmware engineer (nRF52/Zephyr/NCS v2.9.0), remote, Bhaini Khurd village, Karnal, Haryana
- Wife (DTP clerk), daughter age 9, son age 4
- Gym 7–8:30 AM, 6 days/week (85→83 kg target)
- Rental property portfolio in Karnal (₹1L/month target)
- Family trip Dharamshala June 4–7 — already planned
- Protects 5–7 PM for family, no work calls
- R&D lead changes requirements mid-project — primary frustration
- Swing trading: ₹2L capital, paper trading phase, 17 stocks, ~₹3.9L underwater

Active operations (${tasks.filter(t=>!t.done).length} open):
${tasks.filter(t=>!t.done).map(t=>`  [${t.priority.toUpperCase()}/${t.area}] ${t.title}${t.dueDate?' · due '+t.dueDate:''}`).join('\n')||'  None — all clear'}

Overdue: ${tasks.filter(t=>t.dueDate&&!t.done&&new Date(t.dueDate)<new Date()).map(t=>t.title).join(', ')||'None'}

Recent journal (${entries.length} entries):
${entries.slice(0,2).map(e=>`  "${e.title}": ${e.body.slice(0,80)}…`).join('\n')||'  None yet'}

Respond like an exceptionally competent chief of staff — direct, decisive, zero filler.
Under 120 words unless explicitly asked for more. No bullet overload. Think, then speak.`

const QUICK = [
  'What needs my attention right now?',
  'Auto-prioritize my open tasks',
  'What am I avoiding?',
  'Quick win in under 30 minutes?',
  'Morning briefing',
]

export function AITab({ tasks, journalEntries, addToast }) {
  const [history, setHistory] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoad, setBriefingLoad] = useState(false)
  const endRef = useRef(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[history])

  async function send(msg) {
    const m=(msg||input).trim(); if(!m||loading)return
    setInput('')
    setHistory(h=>[...h,{role:'user',text:m}])
    setLoading(true)
    try {
      const reply = await askClaude(SYSTEM(tasks, journalEntries), m)
      setHistory(h=>[...h,{role:'ai',text:reply}])
    } catch {
      setHistory(h=>[...h,{role:'error',text:'Connection failed. Check network.'}])
    }
    setLoading(false)
  }

  async function getBriefing() {
    setBriefingLoad(true); setBriefing(null)
    const sys=`You are Anil's morning briefing AI. Extremely concise — 5 lines max.
Line 1: Priority #1 for today (bold action, not vague)
Line 2: Any overdue item requiring immediate action
Line 3: One quick win possible before 10 AM
Line 4: Evening reminder (family 5-7 PM protected)
Line 5: One sentence on his energy or momentum today
No markdown. No headers. Just 5 plain lines. Under 80 words total.`
    try {
      const r=await askClaude(sys,`Open tasks:\n${tasks.filter(t=>!t.done).map(t=>`[${t.priority}/${t.area}] ${t.title}`).join('\n')||'None'}\n\nGive me my morning brief.`)
      setBriefing(r)
    } catch { setBriefing('Could not generate briefing. Check connection.') }
    setBriefingLoad(false)
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

      {/* Briefing card */}
      <div style={{padding:'12px 14px 6px',flexShrink:0}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:14,padding:'14px',marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--signal)',letterSpacing:4,marginBottom:2}}>☀ MORNING BRIEF</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',letterSpacing:1}}>AI summary of your day</div>
            </div>
            <button onClick={getBriefing} disabled={briefingLoad}
              style={{padding:'7px 12px',background:briefingLoad?'transparent':'var(--signal)15',border:`1px solid var(--signal)${briefingLoad?'20':'40'}`,borderRadius:8,color:briefingLoad?'var(--muted)':'var(--signal)',fontFamily:'var(--font-display)',fontSize:13,letterSpacing:3}}>
              {briefingLoad?<span className="pulsing">…</span>:'BRIEF'}
            </button>
          </div>
          {briefing&&(
            <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--rim)',fontFamily:'var(--font-ui)',fontSize:13,color:'var(--text)',lineHeight:1.9,fontWeight:300}}>
              {briefing}
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div style={{display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
          {QUICK.map(p=>(
            <button key={p} onClick={()=>send(p)} style={{
              padding:'7px 12px',background:'var(--elevated)',border:'1px solid var(--rim2)',
              borderRadius:20,color:'var(--dim)',fontFamily:'var(--font-mono)',fontSize:10,
              whiteSpace:'nowrap',flexShrink:0,letterSpacing:.5,transition:'all .15s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'10px 14px 8px',display:'flex',flexDirection:'column',gap:10}}>
        {history.length===0&&(
          <div style={{textAlign:'center',padding:'30px 20px',flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:48,letterSpacing:6,color:'var(--rim)',marginBottom:6}}>◎</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',letterSpacing:4}}>INTEL CORE ONLINE</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',marginTop:8,lineHeight:1.8}}>
              Tap a prompt above or type below.<br/>I know your tasks, your priorities, your life.
            </div>
          </div>
        )}
        {history.map((m,i)=>(
          <div key={i} style={{
            maxWidth:'88%',alignSelf:m.role==='user'?'flex-end':'flex-start',
            padding:'12px 15px',
            borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',
            background:m.role==='user'?'var(--elevated)':m.role==='error'?'#1a0808':'var(--surface)',
            border:m.role==='user'?'1px solid var(--rim2)':m.role==='error'?'1px solid var(--critical)30':'1px solid var(--rim)',
            color:m.role==='error'?'var(--critical)':'var(--text)',
            fontFamily:'var(--font-ui)',fontSize:13,lineHeight:1.7,fontWeight:300,
          }}>
            {m.role==='ai'&&<div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:3,color:'var(--signal)',marginBottom:6}}>◎ INTEL</div>}
            {m.text}
          </div>
        ))}
        {loading&&(
          <div style={{maxWidth:'60%',padding:'12px 15px',borderRadius:'16px 16px 16px 4px',background:'var(--surface)',border:'1px solid var(--rim)'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:3,color:'var(--signal)',marginBottom:6}}>◎ INTEL</div>
            <div className="pulsing" style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--subtle)'}}>processing…</div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{padding:'10px 14px',borderTop:'1px solid var(--rim)',flexShrink:0,paddingBottom:'calc(10px + env(safe-area-inset-bottom,0px))'}}>
        <div style={{display:'flex',gap:8,background:'var(--surface)',border:'1px solid var(--rim2)',borderRadius:14,padding:'8px 8px 8px 14px'}}>
          <textarea rows={2} value={input} onChange={e=>setInput(e.target.value)}
            placeholder="What's on your mind?"
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
            style={{flex:1,background:'transparent',border:'none',color:'var(--text)',fontSize:13,lineHeight:1.5,outline:'none',paddingTop:2,fontWeight:300}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{
            width:44,height:44,background:loading||!input.trim()?'var(--elevated)':'var(--signal)',
            border:'none',borderRadius:10,color:loading||!input.trim()?'var(--muted)':'var(--deep)',
            fontFamily:'var(--font-display)',fontSize:20,letterSpacing:1,flexShrink:0,alignSelf:'flex-end',transition:'all .15s',
          }}>→</button>
        </div>
      </div>
    </div>
  )
}
