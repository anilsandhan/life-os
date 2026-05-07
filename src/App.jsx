// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Header }     from './components/Header'
import { BottomNav }  from './components/BottomNav'
import { Toasts }     from './components/Toasts'
import { TasksTab }   from './components/TasksTab'
import { StatsTab }   from './components/StatsTab'
import { AITab }      from './components/AITab'
import { CaptureTab } from './components/CaptureTab'
import { useStorage }  from './hooks/useStorage'
import { useToasts }   from './hooks/useToasts'
import { useDailyReminders, useTaskReminders } from './hooks/useReminders'
import { SEED_TASKS }  from './constants'

let _importId = 500

export default function App() {
  const [tasks, setTasks]               = useStorage('lifeos_v2_tasks', SEED_TASKS)
  const [tab, setTab]                   = useState('tasks')
  const [remindersOn, setRemindersOn]   = useStorage('lifeos_reminders', true)

  const { toasts, add: addToast, remove: removeToast } = useToasts()
  const { schedule, cancel }    = useTaskReminders(addToast)
  useDailyReminders(addToast, remindersOn)

  // Reschedule existing task reminders on mount
  useEffect(() => {
    tasks.forEach(t => {
      if (t.notifyAt && t.notifyAt > Date.now() && !t.done) {
        schedule(t, t.notifyAt - Date.now())
      }
    })
  }, [])

  // Recurring task reset — check daily at load
  useEffect(() => {
    const today = new Date().toDateString()
    const lastReset = localStorage.getItem('lifeos_last_reset')
    if (lastReset === today) return
    localStorage.setItem('lifeos_last_reset', today)
    setTasks(prev => prev.map(t => {
      if (t.recurring && t.done) {
        return { ...t, done: false, ts: Date.now() }
      }
      return t
    }))
  }, [])

  function importTasks(extracted) {
    const newTasks = extracted.map(t => ({
      id: _importId++, title: t.title, area: t.area || 'Other',
      priority: t.priority || 'medium', done: false, ts: Date.now(),
      notifyAt: null, note: '', recurring: null, dueDate: null,
    }))
    setTasks(p => [...newTasks, ...p])
    setTab('tasks')
    addToast('IMPORTED', `${newTasks.length} tasks added to your list`, '⬡', 'var(--orange)')
  }

  const total = tasks.length
  const done  = tasks.filter(t => t.done).length

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <Toasts toasts={toasts} remove={removeToast} />

      <Header
        total={total} done={done}
        remindersOn={remindersOn} setRemindersOn={setRemindersOn}
      />

      {/* Tab content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {tab==='tasks'   && <TasksTab   tasks={tasks} setTasks={setTasks} schedule={schedule} cancel={cancel} addToast={addToast} />}
        {tab==='stats'   && <StatsTab   tasks={tasks} />}
        {tab==='ai'      && <AITab      tasks={tasks} addToast={addToast} />}
        {tab==='capture' && <CaptureTab onImport={importTasks} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
