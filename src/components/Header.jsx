import React, { useState, useEffect } from 'react'
import { FIXED_REMINDERS } from '../constants'

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const hh = String(t.getHours()).padStart(2,'0')
  const mm = String(t.getMinutes()).padStart(2,'0')
  const ss = String(t.getSeconds()).padStart(2,'0')
  const day = t.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short'}).toUpperCase()
  return (
    <div style={{textAlign:'right'}}>
      <div style={{fontFamily:'var(--font-display)',fontSize:28,letterSpacing:3,color:'var(--bright)',lineHeight:1}}>
        {hh}<span style={{color:'var(--signal)',animation:'pulse 1s ease infinite'}}> : </span>{mm}
        <span style={{fontSize:16,color:'var(--dim)',letterSpacing:2}}> : {ss}</span>
      </div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)',letterSpacing:3,marginTop:3}}>{day}</div>
    </div>
  )
}

export function Header({ total, done, remindersOn, setRemindersOn }) {
  const pct = total ? Math.round((done/total)*100) : 0
  const r = 18, circ = 2*Math.PI*r, offset = circ-(pct/100)*circ

  return (
    <div style={{
      background:'var(--deep)', borderBottom:'1px solid var(--rim)',
      flexShrink:0, position:'relative', overflow:'hidden',
    }}>
      {/* Subtle grid texture */}
      <div style={{
        position:'absolute',inset:0,opacity:.03,
        backgroundImage:'linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)',
        backgroundSize:'24px 24px', pointerEvents:'none',
      }}/>

      <div style={{height:'env(safe-area-inset-top,0px)'}}/>

      <div style={{padding:'14px 18px 12px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',position:'relative'}}>
        {/* Left — identity */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'var(--signal)',boxShadow:'0 0 8px var(--signal)'}}/> 
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--signal)',letterSpacing:4}}>OPERATIONAL</span>
          </div>
          <div style={{fontFamily:'var(--font-display)',fontSize:32,letterSpacing:4,color:'var(--bright)',lineHeight:1}}>
            COMMAND
          </div>
          <div style={{fontFamily:'var(--font-display)',fontSize:32,letterSpacing:4,color:'var(--dim)',lineHeight:1}}>
            CENTER
          </div>
        </div>
        {/* Right — clock */}
        <Clock/>
      </div>

      {/* Progress strip */}
      <div style={{padding:'0 18px 10px',display:'flex',alignItems:'center',gap:10}}>
        {/* Ring */}
        <svg width={44} height={44} style={{transform:'rotate(-90deg)',flexShrink:0}}>
          <circle cx={22} cy={22} r={r} fill="none" stroke="var(--rim2)" strokeWidth={2.5}/>
          <circle cx={22} cy={22} r={r} fill="none"
            stroke={pct===100?'var(--success)':'var(--signal)'}
            strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{transition:'stroke-dashoffset .7s ease'}}/>
        </svg>
        <div style={{flex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--dim)',letterSpacing:1}}>
              {done} OF {total} CLOSED
            </span>
            <span style={{fontFamily:'var(--font-display)',fontSize:16,color:pct===100?'var(--success)':'var(--signal)',letterSpacing:2}}>
              {pct}%
            </span>
          </div>
          <div style={{height:2,background:'var(--rim)',borderRadius:1}}>
            <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,var(--signal-d),var(--signal-l))`,borderRadius:1,transition:'width .7s ease'}}/>
          </div>
        </div>
      </div>

      {/* Schedule pills */}
      <div style={{padding:'0 18px 12px',display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',alignItems:'center'}}>
        <span style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--muted)',letterSpacing:3,flexShrink:0}}>SCHEDULE</span>
        {FIXED_REMINDERS.map(r=>(
          <div key={r.id} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',flexShrink:0,
            background:`${r.color}10`,border:`1px solid ${r.color}25`,borderRadius:20,
          }}>
            <div style={{width:4,height:4,borderRadius:'50%',background:r.color}}/>
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:r.color,letterSpacing:1}}>{r.label}</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--dim)'}}>{r.title}</span>
          </div>
        ))}
        <button onClick={()=>setRemindersOn(v=>!v)} style={{
          marginLeft:'auto',flexShrink:0,padding:'4px 10px',borderRadius:20,
          background:remindersOn?'#0a1a0a':'transparent',
          border:`1px solid ${remindersOn?'var(--success)':'var(--muted)'}`,
          color:remindersOn?'var(--success)':'var(--muted)',
          fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:2,
        }}>{remindersOn?'● LIVE':'○ OFF'}</button>
      </div>
    </div>
  )
}
