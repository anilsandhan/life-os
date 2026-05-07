// src/components/TaskCard.jsx
import React, { useState, useRef } from 'react'
import { AREA_COLOR, PRIO_COLOR } from '../constants'

function PresetPicker({ onPick, onCustom, onClose }) {
  const tm = (h, m=0, addDay=false) => {
    const d = new Date(); d.setHours(h, m, 0, 0)
    if (addDay || d <= Date.now()) d.setDate(d.getDate() + 1)
    return d.getTime() - Date.now()
  }
  const presets = [
    ['30 min', 30*60000], ['1 hour', 60*60000], ['3 hours', 3*60*60000],
    ['Eve 6:30', tm(18,30)], ['Tmr 9:30', tm(9,30,true)],
  ]
  return (
    <div style={{ marginTop:10, padding:'12px', background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:10 }}>
      <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:3, color:'var(--orange)', marginBottom:8 }}>REMIND ME</div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
        {presets.map(([label, ms]) => (
          <button key={label} onClick={() => onPick(ms)} style={{ padding:'6px 12px', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:11 }}>{label}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={onCustom} style={{ padding:'6px 11px', background:'transparent', border:'1px solid var(--border2)', borderRadius:8, color:'var(--text2)', fontSize:11 }}>Custom…</button>
        <button onClick={onClose}  style={{ padding:'6px 11px', background:'transparent', border:'1px solid var(--border)',  borderRadius:8, color:'var(--text3)', fontSize:11 }}>Cancel</button>
      </div>
    </div>
  )
}

function NoteEditor({ note, onSave, onClose }) {
  const [val, setVal] = useState(note || '')
  return (
    <div style={{ marginTop:10, padding:'12px', background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:10 }}>
      <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:3, color:'var(--blue)', marginBottom:8 }}>NOTE</div>
      <textarea value={val} onChange={e => setVal(e.target.value)} rows={3} autoFocus
        placeholder="Add a note…"
        style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, padding:'10px', color:'var(--text)', fontSize:12, lineHeight:1.5, outline:'none' }} />
      <div style={{ display:'flex', gap:6, marginTop:8 }}>
        <button onClick={() => onSave(val)} style={{ flex:1, padding:'7px', background:'var(--blue)', border:'none', borderRadius:8, color:'#fff', fontFamily:'var(--font-head)', fontWeight:800, fontSize:10, letterSpacing:1 }}>SAVE</button>
        <button onClick={onClose} style={{ padding:'7px 12px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, color:'var(--text3)', fontSize:11 }}>✕</button>
      </div>
    </div>
  )
}

export function TaskCard({ task, onToggle, onDelete, onSetNotify, onClearNotify, onOpenDateModal, onUpdateNote, idx=0 }) {
  const [panel, setPanel] = useState(null) // 'notify' | 'note'
  const touchStartX = useRef(null)
  const innerRef = useRef(null)
  const [swipeDx, setSwipeDx] = useState(0)

  const hasNotify = task.notifyAt && task.notifyAt > Date.now()
  const ac = AREA_COLOR[task.area] || '#94a3b8'
  const pc = PRIO_COLOR[task.priority]

  // Swipe-to-complete
  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchMove(e) {
    if (touchStartX.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    if (dx > 0) setSwipeDx(Math.min(dx, 80))
  }
  function onTouchEnd() {
    if (swipeDx > 55) onToggle()
    setSwipeDx(0); touchStartX.current = null
  }

  const dueStr = task.dueDate ? (() => {
    const d = new Date(task.dueDate); const now = new Date()
    const diff = Math.ceil((d - now) / 86400000)
    if (diff < 0)  return { label:`${Math.abs(diff)}d overdue`, color:'var(--red)' }
    if (diff === 0) return { label:'Due today', color:'var(--amber)' }
    if (diff <= 3) return { label:`${diff}d left`, color:'var(--amber)' }
    return { label:`${diff}d left`, color:'var(--text3)' }
  })() : null

  return (
    <div className="fade-up task-swipe-wrap" style={{ animationDelay:`${idx*.04}s`, padding:'0 14px 7px', position:'relative' }}>
      {/* Swipe bg */}
      <div style={{ position:'absolute', left:14, right:14, top:0, bottom:7, background:'var(--green)18', borderRadius:12, display:'flex', alignItems:'center', paddingLeft:16, opacity: swipeDx/80 }}>
        <span style={{ fontSize:18 }}>✓</span>
      </div>

      <div ref={innerRef}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        className={swipeDx > 0 ? 'task-swipe-inner swiping' : 'task-swipe-inner'}
        style={{ transform:`translateX(${swipeDx}px)` }}>
        <div style={{
          padding:'13px 12px 13px 14px', background:'var(--bg2)',
          border:'1px solid var(--border)', borderLeft:`3px solid ${pc}`,
          borderRadius:12, display:'flex', gap:12, alignItems:'flex-start',
          boxShadow:'0 2px 16px #00000040',
        }}>
          {/* Checkbox */}
          <div onClick={onToggle} style={{
            width:20, height:20, borderRadius:5, border:`2px solid ${pc}`,
            flexShrink:0, marginTop:1, cursor:'pointer', transition:'all .15s',
            display:'flex', alignItems:'center', justifyContent:'center',
          }} />

          {/* Body */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, color:'var(--text)', lineHeight:1.4, marginBottom:7 }}>
              {task.title}
              {task.recurring && <span style={{ marginLeft:6, fontSize:10 }}>🔁</span>}
            </div>
            {/* Note preview */}
            {task.note && panel !== 'note' && (
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text3)', lineHeight:1.4, marginBottom:7, padding:'6px 10px', background:'var(--bg3)', borderRadius:6, borderLeft:'2px solid var(--blue)' }}>
                {task.note.length > 80 ? task.note.slice(0,80)+'…' : task.note}
              </div>
            )}
            {/* Badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:5, alignItems:'center' }}>
              <Badge color={ac}>{task.area.toUpperCase()}</Badge>
              <Badge color={pc}>{task.priority.toUpperCase()}</Badge>
              {dueStr && <Badge color={dueStr.color}>📅 {dueStr.label}</Badge>}
              {hasNotify && (
                <button onClick={onClearNotify} style={{ fontSize:9, color:'var(--yellow)', background:'#1c150010', border:'1px solid #facc1440', borderRadius:4, padding:'2px 7px', fontFamily:'var(--font-mono)', cursor:'pointer' }}>
                  ⏰ {new Date(task.notifyAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} ✕
                </button>
              )}
            </div>

            {/* Panels */}
            {panel === 'notify' && (
              <PresetPicker
                onPick={ms => { onSetNotify(Date.now()+ms); setPanel(null) }}
                onCustom={() => { setPanel(null); onOpenDateModal() }}
                onClose={() => setPanel(null)}
              />
            )}
            {panel === 'note' && (
              <NoteEditor note={task.note} onSave={v => { onUpdateNote(v); setPanel(null) }} onClose={() => setPanel(null)} />
            )}
          </div>

          {/* Actions column */}
          <div style={{ display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}>
            <Btn color={hasNotify?'var(--yellow)':'var(--text4)'} border={hasNotify?'#facc1444':'var(--border)'} onClick={() => setPanel(p => p==='notify'?null:'notify')}>🔔</Btn>
            <Btn color="var(--text3)" border="var(--border)" onClick={() => setPanel(p => p==='note'?null:'note')}>📝</Btn>
            <Btn color="var(--text4)" border="var(--border)" onClick={onDelete}>✕</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DoneCard({ task, onToggle, onDelete }) {
  return (
    <div style={{ padding:'0 14px 5px', opacity:0.38 }}>
      <div style={{ padding:'10px 13px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, display:'flex', gap:10, alignItems:'center' }}>
        <div onClick={onToggle} style={{ width:20, height:20, borderRadius:5, background:'var(--green)', border:'2px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <span style={{ fontSize:10, color:'#080810', fontWeight:900 }}>✓</span>
        </div>
        <div style={{ flex:1, fontFamily:'var(--font-head)', fontSize:12, color:'var(--text3)', textDecoration:'line-through', lineHeight:1.4 }}>{task.title}</div>
        <button onClick={onDelete} style={{ color:'var(--text4)', fontSize:14, padding:2 }}>✕</button>
      </div>
    </div>
  )
}

function Badge({ color, children }) {
  return (
    <span style={{ fontSize:9, fontFamily:'var(--font-head)', fontWeight:800, letterSpacing:1.5, color, background:`${color}15`, border:`1px solid ${color}40`, borderRadius:4, padding:'2px 8px', whiteSpace:'nowrap' }}>
      {children}
    </span>
  )
}
function Btn({ color, border, onClick, children }) {
  return (
    <button onClick={onClick} style={{ background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'5px 8px', fontSize:13, color, transition:'all .15s' }}>
      {children}
    </button>
  )
}
