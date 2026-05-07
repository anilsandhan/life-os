// src/components/TasksTab.jsx
import React, { useState } from 'react'
import { AREAS, AREA_COLOR, PRIO_COLOR } from '../constants'
import { TaskCard, DoneCard } from './TaskCard'

let _nextId = 300

function DateModal({ task, onSave, onClose }) {
  const [val, setVal] = useState('')
  const min = new Date(Date.now()+60000).toISOString().slice(0,16)
  return (
    <div style={{ position:'fixed', inset:0, background:'#000000cc', zIndex:8000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div className="slide-up" style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:18, padding:24, width:'100%', maxWidth:340 }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:6 }}>Set Reminder</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text3)', marginBottom:16, lineHeight:1.5 }}>{task.title}</div>
        <input type="datetime-local" min={min} value={val} onChange={e => setVal(e.target.value)}
          style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:10, padding:'11px 12px', color:'var(--text)', fontSize:12, marginBottom:14, outline:'none' }} />
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => val && onSave(new Date(val).getTime())} disabled={!val}
            style={{ flex:1, padding:12, background:val?'var(--orange)':'var(--bg3)', border:'none', borderRadius:10, color:val?'#fff':'var(--text4)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:11, letterSpacing:1 }}>
            SET REMINDER
          </button>
          <button onClick={onClose} style={{ padding:'12px 16px', background:'transparent', border:'1px solid var(--border2)', borderRadius:10, color:'var(--text2)', fontSize:13 }}>✕</button>
        </div>
      </div>
    </div>
  )
}

function AddTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [area, setArea]   = useState('Work')
  const [prio, setPrio]   = useState('medium')
  const [due, setDue]     = useState('')
  const [note, setNote]   = useState('')
  const [recur, setRecur] = useState('')

  function submit() {
    if (!title.trim()) return
    onAdd({ title:title.trim(), area, priority:prio, dueDate:due||null, note, recurring:recur||null })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'#000000dd', zIndex:8000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div className="slide-up" style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderTop:'none', borderRadius:'20px 20px 0 0', padding:'20px 20px', paddingBottom:'calc(20px + env(safe-area-inset-bottom, 0px))', width:'100%', maxWidth:480 }}>
        {/* Handle */}
        <div style={{ width:40, height:4, background:'var(--border2)', borderRadius:2, margin:'0 auto 18px' }} />
        <div style={{ fontFamily:'var(--font-head)', fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:14 }}>New Task</div>

        <input autoFocus placeholder="What needs to get done?" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key==='Enter' && submit()}
          style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px', color:'var(--text)', fontSize:14, marginBottom:10, outline:'none' }} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:2, color:'var(--text4)', marginBottom:5 }}>AREA</div>
            <select value={area} onChange={e => setArea(e.target.value)}
              style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, padding:'9px 8px', color:'var(--text)', fontSize:12, outline:'none' }}>
              {['Work','Property','Family','Home','Health','Finance','Other'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:2, color:'var(--text4)', marginBottom:5 }}>PRIORITY</div>
            <select value={prio} onChange={e => setPrio(e.target.value)}
              style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, padding:'9px 8px', color:'var(--text)', fontSize:12, outline:'none' }}>
              <option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:2, color:'var(--text4)', marginBottom:5 }}>DUE DATE</div>
            <input type="date" value={due} onChange={e => setDue(e.target.value)}
              style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, padding:'9px 8px', color:due?'var(--text)':'var(--text4)', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:8, fontWeight:800, letterSpacing:2, color:'var(--text4)', marginBottom:5 }}>RECURRING</div>
            <select value={recur} onChange={e => setRecur(e.target.value)}
              style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, padding:'9px 8px', color:'var(--text)', fontSize:12, outline:'none' }}>
              <option value="">None</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <textarea placeholder="Optional note…" value={note} onChange={e => setNote(e.target.value)} rows={2}
          style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:10, padding:'10px 12px', color:'var(--text)', fontSize:12, lineHeight:1.5, outline:'none', marginBottom:12 }} />

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={submit} style={{ flex:1, padding:13, background:'var(--orange)', border:'none', borderRadius:12, color:'#fff', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12, letterSpacing:1 }}>ADD TASK</button>
          <button onClick={onClose} style={{ padding:'13px 16px', background:'transparent', border:'1px solid var(--border2)', borderRadius:12, color:'var(--text3)', fontSize:13 }}>✕</button>
        </div>
      </div>
    </div>
  )
}

export function TasksTab({ tasks, setTasks, schedule, cancel, addToast }) {
  const [filter, setFilter]   = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [dateModal, setDateModal] = useState(null)
  const [search, setSearch]   = useState('')

  const toggleTask = id => {
    setTasks(t => t.map(x => {
      if (x.id !== id) return x
      // Handle recurring: if completing a recurring task, reset it for next occurrence
      if (!x.done && x.recurring) {
        addToast('RECURRING TASK', `"${x.title.slice(0,30)}" will reappear ${x.recurring}`, '🔁', '#a78bfa')
      }
      return { ...x, done: !x.done }
    }))
  }

  const deleteTask = id => { cancel(id); setTasks(t => t.filter(x => x.id !== id)) }

  function addTask({ title, area, priority, dueDate, note, recurring }) {
    setTasks(p => [{ id:_nextId++, title, area, priority, done:false, ts:Date.now(), notifyAt:null, note, recurring, dueDate }, ...p])
    setShowAdd(false)
  }

  function setNotifyAt(taskId, ts) {
    setTasks(t => t.map(x => x.id===taskId ? {...x, notifyAt:ts} : x))
    const task = tasks.find(x => x.id===taskId)
    if (task) {
      schedule({...task, notifyAt:ts}, ts-Date.now())
      addToast('REMINDER SET', new Date(ts).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}), '⏰', '#facc15')
    }
    setDateModal(null)
  }

  function clearNotify(taskId) { cancel(taskId); setTasks(t => t.map(x => x.id===taskId ? {...x,notifyAt:null} : x)) }
  function updateNote(taskId, note) { setTasks(t => t.map(x => x.id===taskId ? {...x,note} : x)) }

  let filtered = tasks.filter(t => (filter==='All' || t.area===filter) && (!search || t.title.toLowerCase().includes(search.toLowerCase())))
  const open   = [...filtered.filter(t => !t.done)].sort((a,b) => ({high:0,medium:1,low:2}[a.priority]-{high:0,medium:1,low:2}[b.priority] || b.ts-a.ts))
  const done   = [...filtered.filter(t => t.done)].sort((a,b) => b.ts-a.ts)

  // Count by area for filter chips
  const areaCounts = {}
  tasks.filter(t=>!t.done).forEach(t => { areaCounts[t.area] = (areaCounts[t.area]||0)+1 })

  return (
    <>
      {showAdd  && <AddTaskModal onAdd={addTask} onClose={() => setShowAdd(false)} />}
      {dateModal && <DateModal task={dateModal} onSave={ts => setNotifyAt(dateModal.id, ts)} onClose={() => setDateModal(null)} />}

      {/* Search bar */}
      <div style={{ padding:'10px 14px 6px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 13px' }}>
          <span style={{ color:'var(--text4)', fontSize:14 }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
            style={{ flex:1, background:'transparent', border:'none', color:'var(--text)', fontSize:13, outline:'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ color:'var(--text4)', fontSize:13 }}>✕</button>}
        </div>
      </div>

      {/* Area chips */}
      <div style={{ display:'flex', gap:5, padding:'6px 14px 8px', overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
        {AREAS.map(a => {
          const count = a==='All' ? tasks.filter(t=>!t.done).length : (areaCounts[a]||0)
          return (
            <button key={a} onClick={() => setFilter(a)} style={{
              padding:'6px 12px', borderRadius:20, fontSize:10,
              fontFamily:'var(--font-head)', fontWeight:800, letterSpacing:1,
              border:'1px solid', whiteSpace:'nowrap', transition:'all .15s',
              borderColor: filter===a ? (AREA_COLOR[a]||'var(--orange)') : 'var(--border)',
              background:  filter===a ? `${AREA_COLOR[a]||'#f97316'}15` : 'transparent',
              color:       filter===a ? (AREA_COLOR[a]||'var(--orange)') : 'var(--text3)',
            }}>
              {a}{count>0 ? ` ${count}` : ''}
            </button>
          )
        })}
      </div>

      {/* Add button */}
      <div style={{ padding:'0 14px 8px', flexShrink:0 }}>
        <button onClick={() => setShowAdd(true)} style={{
          width:'100%', padding:'12px', background:'transparent',
          border:'1px dashed var(--border2)', borderRadius:12,
          color:'var(--text3)', fontFamily:'var(--font-head)', fontWeight:800,
          fontSize:10, letterSpacing:3, transition:'all .15s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          <span style={{ fontSize:18, lineHeight:1 }}>+</span> NEW TASK
        </button>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', paddingBottom:'calc(var(--nav-h) + 10px)' }}>
        {open.length > 0 && (
          <>
            <SLabel text="OPEN" count={open.length} color="var(--orange)" />
            {open.map((t,i) => (
              <TaskCard key={t.id} task={t} idx={i}
                onToggle={() => toggleTask(t.id)}
                onDelete={() => deleteTask(t.id)}
                onSetNotify={ts => setNotifyAt(t.id, ts)}
                onClearNotify={() => clearNotify(t.id)}
                onOpenDateModal={() => setDateModal(t)}
                onUpdateNote={v => updateNote(t.id, v)}
              />
            ))}
          </>
        )}
        {done.length > 0 && (
          <>
            <SLabel text="DONE" count={done.length} color="var(--green)" />
            {done.map(t => <DoneCard key={t.id} task={t} onToggle={() => toggleTask(t.id)} onDelete={() => deleteTask(t.id)} />)}
          </>
        )}
        {open.length===0 && done.length===0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', fontFamily:'var(--font-head)', fontSize:11, letterSpacing:3, color:'var(--text4)', lineHeight:2.5 }}>
            {search ? `NO RESULTS FOR "${search.toUpperCase()}"` : 'ALL CLEAR'}<br/>
            <span style={{ fontSize:8 }}>{search ? 'TRY A DIFFERENT SEARCH' : 'ADD A TASK ABOVE'}</span>
          </div>
        )}
      </div>
    </>
  )
}

function SLabel({ text, count, color }) {
  return (
    <div style={{ padding:'8px 14px 6px', display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, letterSpacing:4, color:'var(--text4)' }}>{text}</span>
      <span style={{ fontFamily:'var(--font-head)', fontSize:9, fontWeight:800, color, background:`${color}15`, border:`1px solid ${color}30`, borderRadius:3, padding:'1px 8px' }}>{count}</span>
    </div>
  )
}
