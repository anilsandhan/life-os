// src/components/TasksTab.jsx
import React, { useState } from 'react'
import { AREAS, AREA_COLOR, PRIO_COLOR, SEED_TASKS } from '../constants'
import { TaskCard, DoneCard } from './TaskCard'

let _nextId = 300

function DateModal({ task, onSave, onClose }) {
  const [val, setVal] = useState('')
  const min = new Date(Date.now() + 60000).toISOString().slice(0, 16)
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 340 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Set Reminder</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.5 }}>{task.title}</div>
        <input type="datetime-local" min={min} value={val} onChange={e => setVal(e.target.value)}
          style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 14, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => val && onSave(new Date(val).getTime())} disabled={!val}
            style={{ flex: 1, padding: 11, background: val ? 'var(--orange)' : 'var(--bg3)', border: 'none', borderRadius: 8, color: val ? '#fff' : 'var(--text4)', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11, letterSpacing: 1 }}>
            SET REMINDER
          </button>
          <button onClick={onClose} style={{ padding: '11px 16px', background: 'transparent', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text2)', fontSize: 12 }}>✕</button>
        </div>
      </div>
    </div>
  )
}

export function TasksTab({ tasks, setTasks, schedule, cancel, addToast }) {
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newArea, setNewArea] = useState('Work')
  const [newPrio, setNewPrio] = useState('medium')
  const [dateModal, setDateModal] = useState(null)

  const toggleTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
  const deleteTask = id => { cancel(id); setTasks(t => t.filter(x => x.id !== id)) }

  function addTask() {
    if (!newTitle.trim()) return
    setTasks(p => [{ id: _nextId++, title: newTitle.trim(), area: newArea, priority: newPrio, done: false, ts: Date.now(), notifyAt: null }, ...p])
    setNewTitle(''); setShowAdd(false)
  }

  function setNotifyAt(taskId, ts) {
    setTasks(t => t.map(x => x.id === taskId ? { ...x, notifyAt: ts } : x))
    const task = tasks.find(x => x.id === taskId)
    if (task) {
      schedule({ ...task, notifyAt: ts }, ts - Date.now())
      addToast('REMINDER SET', new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), '⏰', '#facc15')
    }
    setDateModal(null)
  }

  function clearNotify(taskId) {
    cancel(taskId)
    setTasks(t => t.map(x => x.id === taskId ? { ...x, notifyAt: null } : x))
  }

  const filtered = tasks.filter(t => filter === 'All' || t.area === filter)
  const open = [...filtered.filter(t => !t.done)].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority] || b.ts - a.ts))
  const done = [...filtered.filter(t => t.done)].sort((a, b) => b.ts - a.ts)

  return (
    <>
      {dateModal && <DateModal task={dateModal} onSave={ts => setNotifyAt(dateModal.id, ts)} onClose={() => setDateModal(null)} />}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 14px 10px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
        {AREAS.map(a => (
          <button key={a} onClick={() => setFilter(a)} style={{
            padding: '6px 13px', borderRadius: 6, fontSize: 9,
            fontFamily: 'var(--font-head)', fontWeight: 800, letterSpacing: 2,
            border: '1px solid', whiteSpace: 'nowrap', transition: 'all .15s',
            borderColor: filter === a ? 'var(--orange)' : 'var(--border)',
            background: filter === a ? '#1e0e00' : 'transparent',
            color: filter === a ? 'var(--orange)' : 'var(--text3)',
          }}>{a}</button>
        ))}
      </div>

      {/* Add task */}
      <div style={{ padding: '0 14px 10px', flexShrink: 0 }}>
        {!showAdd
          ? <button onClick={() => setShowAdd(true)} style={{
              width: '100%', padding: 12, background: 'transparent',
              border: '1px dashed var(--border2)', borderRadius: 10,
              color: 'var(--text3)', fontFamily: 'var(--font-head)', fontWeight: 800,
              fontSize: 10, letterSpacing: 3, transition: 'all .15s'
            }}>+ NEW TASK</button>
          : <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, padding: 14 }}>
              <input autoFocus placeholder="What needs to get done?" value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, marginBottom: 10, outline: 'none' }} />
              <div style={{ display: 'flex', gap: 7 }}>
                <select value={newArea} onChange={e => setNewArea(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px', color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                  {AREAS.slice(1).map(a => <option key={a}>{a}</option>)}
                </select>
                <select value={newPrio} onChange={e => setNewPrio(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px', color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                  <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                </select>
                <button onClick={addTask} style={{ padding: '8px 16px', background: 'var(--orange)', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 11 }}>ADD</button>
                <button onClick={() => setShowAdd(false)} style={{ padding: '8px 11px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text3)' }}>✕</button>
              </div>
            </div>
        }
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        {open.length > 0 && (
          <>
            <SectionLabel text="OPEN" count={open.length} color="var(--orange)" />
            {open.map((t, i) => (
              <TaskCard key={t.id} task={t} idx={i}
                onToggle={() => toggleTask(t.id)}
                onDelete={() => deleteTask(t.id)}
                onSetNotify={ts => setNotifyAt(t.id, ts)}
                onClearNotify={() => clearNotify(t.id)}
                onOpenDateModal={() => setDateModal(t)}
              />
            ))}
          </>
        )}
        {done.length > 0 && (
          <>
            <SectionLabel text="DONE" count={done.length} color="var(--green)" />
            {done.map(t => (
              <DoneCard key={t.id} task={t} onToggle={() => toggleTask(t.id)} onDelete={() => deleteTask(t.id)} />
            ))}
          </>
        )}
        {open.length === 0 && done.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'var(--font-head)', fontSize: 10, letterSpacing: 4, color: 'var(--text4)' }}>
            NO TASKS<br /><span style={{ fontSize: 8 }}>ADD ONE ABOVE</span>
          </div>
        )}
      </div>
    </>
  )
}

function SectionLabel({ text, count, color }) {
  return (
    <div style={{ padding: '8px 14px 7px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800, letterSpacing: 4, color: 'var(--text4)' }}>{text}</span>
      <span style={{ fontFamily: 'var(--font-head)', fontSize: 9, fontWeight: 800, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 3, padding: '1px 8px' }}>{count}</span>
    </div>
  )
}
