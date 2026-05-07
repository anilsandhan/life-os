// src/components/StatsTab.jsx
import React, { useMemo } from 'react'
import { AREA_COLOR, AREA_ICON, PRIO_COLOR } from '../constants'

function Ring({ pct, size=80, stroke=5, color='#f97316', label, sub }) {
  const r = (size-stroke*2)/2
  const circ = 2*Math.PI*r
  const offset = circ - (pct/100)*circ
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border2)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} style={{ transition:'stroke-dashoffset .8s ease' }} />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:size>70?16:12, color:'var(--text)' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:2, color:'var(--text3)', textAlign:'center' }}>{label}</div>
      {sub && <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text4)', textAlign:'center' }}>{sub}</div>}
    </div>
  )
}

function Bar({ label, value, max, color, icon }) {
  const pct = max ? Math.round((value/max)*100) : 0
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:14 }}>{icon}</span>
          <span style={{ fontFamily:'var(--font-head)', fontSize:11, fontWeight:700, color:'var(--text2)' }}>{label}</span>
        </div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>{value} tasks</span>
      </div>
      <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:3, transition:'width .8s ease' }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color='var(--orange)', icon }) {
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 14px', flex:1 }}>
      <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:22, fontWeight:800, color, marginBottom:3 }}>{value}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:2, color:'var(--text3)' }}>{label}</div>
      {sub && <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text4)', marginTop:2 }}>{sub}</div>}
    </div>
  )
}

export function StatsTab({ tasks }) {
  const stats = useMemo(() => {
    const total   = tasks.length
    const done    = tasks.filter(t => t.done).length
    const open    = total - done
    const high    = tasks.filter(t => t.priority==='high' && !t.done).length
    const overdue = tasks.filter(t => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length

    // Area breakdown
    const byArea = {}
    tasks.forEach(t => { byArea[t.area] = byArea[t.area] || {total:0,done:0}; byArea[t.area].total++; if(t.done) byArea[t.area].done++ })

    // Priority breakdown
    const byPrio = { high:{total:0,done:0}, medium:{total:0,done:0}, low:{total:0,done:0} }
    tasks.forEach(t => { byPrio[t.priority].total++; if(t.done) byPrio[t.priority].done++ })

    // Completion this week (simulated from ts)
    const weekAgo = Date.now() - 7*86400000
    const doneThisWeek = tasks.filter(t => t.done && t.ts > weekAgo).length

    // Streak: consecutive days with at least 1 task done (simplified)
    const streak = Math.min(doneThisWeek, 7)

    return { total, done, open, high, overdue, byArea, byPrio, doneThisWeek, streak, pct: total ? Math.round(done/total*100) : 0 }
  }, [tasks])

  const maxAreaCount = Math.max(...Object.values(stats.byArea).map(v => v.total), 1)

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'14px', paddingBottom:'calc(var(--nav-h) + 20px)' }}>
      {/* Header */}
      <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:5, color:'var(--orange)', marginBottom:4 }}>◎ STATISTICS</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:16 }}>Your Productivity</div>

      {/* Top rings */}
      <div style={{ display:'flex', justifyContent:'space-around', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 10px', marginBottom:12 }}>
        <Ring pct={stats.pct}   size={88} stroke={6} color="var(--orange)" label="OVERALL"   sub={`${stats.done}/${stats.total}`} />
        <Ring pct={stats.total ? Math.round(stats.doneThisWeek/Math.max(stats.total,1)*100) : 0} size={70} stroke={5} color="var(--blue)" label="THIS WEEK" sub={`${stats.doneThisWeek} done`} />
        <Ring pct={stats.high>0 ? 0 : 100} size={70} stroke={5} color={stats.high>0?'var(--red)':'var(--green)'} label="HIGH PRIO" sub={stats.high>0?`${stats.high} pending`:'All clear!'} />
      </div>

      {/* Stat cards */}
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <StatCard icon="📋" label="OPEN TASKS"  value={stats.open}         color="var(--text)"   sub="remaining" />
        <StatCard icon="✅" label="COMPLETED"   value={stats.done}         color="var(--green)"  sub="total done" />
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <StatCard icon="🔥" label="STREAK"      value={`${stats.streak}d`} color="var(--orange)" sub="days active" />
        <StatCard icon="⚠️" label="OVERDUE"     value={stats.overdue}      color={stats.overdue>0?'var(--red)':'var(--green)'} sub={stats.overdue>0?'need attention':'all on time'} />
      </div>

      {/* Area breakdown */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'16px', marginBottom:12 }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:3, color:'var(--text4)', marginBottom:12 }}>BY AREA</div>
        {Object.entries(stats.byArea).sort((a,b) => b[1].total-a[1].total).map(([area, {total, done}]) => (
          <Bar key={area} label={area} value={total} max={maxAreaCount} color={AREA_COLOR[area]||'#94a3b8'} icon={AREA_ICON[area]||'📌'} />
        ))}
        {Object.keys(stats.byArea).length===0 && (
          <div style={{ textAlign:'center', padding:'20px', fontFamily:'var(--font-head)', fontSize:10, color:'var(--text4)', letterSpacing:2 }}>NO DATA YET</div>
        )}
      </div>

      {/* Priority breakdown */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'16px' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:3, color:'var(--text4)', marginBottom:12 }}>BY PRIORITY</div>
        {[['high','🔴'],['medium','🟡'],['low','🟢']].map(([p,icon]) => (
          <Bar key={p} label={p.charAt(0).toUpperCase()+p.slice(1)} value={stats.byPrio[p].total} max={stats.total||1} color={PRIO_COLOR[p]} icon={icon} />
        ))}
      </div>
    </div>
  )
}
