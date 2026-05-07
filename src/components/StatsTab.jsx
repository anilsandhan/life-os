import React, { useMemo } from 'react'
import { AREA_COLOR, AREA_ICON, PRIO_COLOR } from '../constants'

function Ring({pct,size=80,stroke=4,color='var(--signal)',label,sub}){
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, off=circ-(pct/100)*circ
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
      <div style={{position:'relative',width:size,height:size}}>
        <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--rim2)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} style={{transition:'stroke-dashoffset .9s ease'}}/>
        </svg>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontFamily:'var(--font-display)',fontSize:size>70?20:14,letterSpacing:1,color:'var(--bright)'}}>{pct}%</span>
        </div>
      </div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:2,color:'var(--subtle)',textAlign:'center'}}>{label}</div>
      {sub&&<div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--muted)',textAlign:'center'}}>{sub}</div>}
    </div>
  )
}

function StatCard({icon,label,value,color='var(--text)',sub}){
  return(
    <div style={{background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:14,padding:'16px 14px',flex:1}}>
      <div style={{fontSize:18,marginBottom:8}}>{icon}</div>
      <div style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:2,color,marginBottom:2}}>{value}</div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:2,color:'var(--subtle)'}}>{label}</div>
      {sub&&<div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--muted)',marginTop:3}}>{sub}</div>}
    </div>
  )
}

function AreaBar({area,total,done,maxTotal}){
  const c=AREA_COLOR[area]||'var(--c-other)'
  const pct=maxTotal?Math.round(total/maxTotal*100):0
  const donePct=total?Math.round(done/total*100):0
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:c}}>{AREA_ICON[area]}</span>
          <span style={{fontFamily:'var(--font-ui)',fontWeight:500,fontSize:12,color:'var(--text2)'}}>{area}</span>
        </div>
        <div style={{display:'flex',gap:10}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--subtle)'}}>{done}/{total}</span>
          <span style={{fontFamily:'var(--font-mono)',fontSize:9,color:donePct===100?'var(--success)':c}}>{donePct}%</span>
        </div>
      </div>
      <div style={{height:4,background:'var(--rim)',borderRadius:2,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${c}80,${c})`,borderRadius:2,transition:'width .9s ease'}}/>
      </div>
    </div>
  )
}

export function StatsTab({ tasks, journalEntries=[] }) {
  const s = useMemo(()=>{
    const total=tasks.length, done=tasks.filter(t=>t.done).length
    const high=tasks.filter(t=>t.priority==='high'&&!t.done).length
    const overdue=tasks.filter(t=>t.dueDate&&!t.done&&new Date(t.dueDate)<new Date()).length
    const byArea={}, byPrio={high:{t:0,d:0},medium:{t:0,d:0},low:{t:0,d:0}}
    tasks.forEach(t=>{
      byArea[t.area]=byArea[t.area]||{total:0,done:0}
      byArea[t.area].total++; if(t.done)byArea[t.area].done++
      byPrio[t.priority].t++; if(t.done)byPrio[t.priority].d++
    })
    const weekAgo=Date.now()-7*86400000
    const doneWeek=tasks.filter(t=>t.done&&t.ts>weekAgo).length
    const streak=Math.min(doneWeek,7)
    const pct=total?Math.round(done/total*100):0
    const healthPct=tasks.filter(t=>t.area==='Health'&&t.done).length/(tasks.filter(t=>t.area==='Health').length||1)*100
    return{total,done,open:total-done,high,overdue,byArea,byPrio,doneWeek,streak,pct,healthPct:Math.round(healthPct)}
  },[tasks])

  const maxArea=Math.max(...Object.values(s.byArea).map(v=>v.total),1)

  return(
    <div style={{flex:1,overflowY:'auto',paddingBottom:'calc(var(--nav-h)+20px)'}}>
      {/* Header */}
      <div style={{padding:'14px 16px 12px',position:'sticky',top:0,background:'var(--deep)',zIndex:10,borderBottom:'1px solid var(--rim)'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:8,color:'var(--signal)',letterSpacing:5,marginBottom:2}}>▲ COMMAND BRIEF</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:3,color:'var(--bright)'}}>INTEL REPORT</div>
      </div>

      <div style={{padding:'14px'}}>
        {/* Rings */}
        <div style={{background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:18,padding:'20px 10px',marginBottom:12,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
          <Ring pct={s.pct} size={90} stroke={5} color="var(--signal)" label="OVERALL" sub={`${s.done}/${s.total}`}/>
          <Ring pct={Math.round(s.doneWeek/Math.max(s.total,1)*100)} size={68} stroke={4} color="var(--info)" label="THIS WEEK" sub={`${s.doneWeek} ops`}/>
          <Ring pct={s.healthPct} size={68} stroke={4} color="var(--success)" label="HEALTH" sub={`gym streak`}/>
        </div>

        {/* Stat cards */}
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <StatCard icon="⬡" label="OPEN OPS"  value={s.open}  color="var(--text)"    sub="pending"/>
          <StatCard icon="✓" label="CLOSED"    value={s.done}  color="var(--success)" sub="total done"/>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          <StatCard icon="●" label="CRITICAL"  value={s.high}  color={s.high>0?'var(--critical)':'var(--success)'} sub={s.high>0?'needs attention':'all clear'}/>
          <StatCard icon="⏱" label="OVERDUE"   value={s.overdue} color={s.overdue>0?'var(--critical)':'var(--success)'} sub={s.overdue>0?'past deadline':'on schedule'}/>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          <StatCard icon="🔥" label="STREAK"   value={`${s.streak}d`} color="var(--signal)" sub="days active"/>
          <StatCard icon="◈" label="LOG ENTRIES" value={journalEntries.length} color="var(--accent)" sub="entries written"/>
        </div>

        {/* Area breakdown */}
        <div style={{background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:16,padding:'16px',marginBottom:12}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:3,color:'var(--muted)',marginBottom:14}}>BY DOMAIN</div>
          {Object.keys(s.byArea).length===0?(
            <div style={{textAlign:'center',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--muted)',letterSpacing:3,padding:'20px 0'}}>NO DATA</div>
          ):Object.entries(s.byArea).sort((a,b)=>b[1].total-a[1].total).map(([area,{total,done}])=>(
            <AreaBar key={area} area={area} total={total} done={done} maxTotal={maxArea}/>
          ))}
        </div>

        {/* Priority */}
        <div style={{background:'var(--surface)',border:'1px solid var(--rim)',borderRadius:16,padding:'16px'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:8,letterSpacing:3,color:'var(--muted)',marginBottom:14}}>BY PRIORITY</div>
          {[['high','CRITICAL'],['medium','NORMAL'],['low','LOW']].map(([p,l])=>(
            <AreaBar key={p} area={p} total={s.byPrio[p].t} done={s.byPrio[p].d} maxTotal={s.total||1}/>
          ))}
        </div>
      </div>
    </div>
  )
}
