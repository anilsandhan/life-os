import React, { useState, useEffect } from 'react'
import { Header }      from './components/Header'
import { BottomNav }   from './components/BottomNav'
import { Toasts }      from './components/Toasts'
import { TasksTab }    from './components/TasksTab'
import { JournalTab }  from './components/JournalTab'
import { AITab }       from './components/AITab'
import { StatsTab }    from './components/StatsTab'
import { CaptureTab }  from './components/CaptureTab'
import { RoadmapTab }  from './components/RoadmapTab'
import { useStorage }  from './hooks/useStorage'
import { useToasts }   from './hooks/useToasts'
import { useDailyReminders, useTaskReminders } from './hooks/useReminders'
import { SEED_TASKS, NAV_TABS }  from './constants'

let _iid = 600

export default function App() {
  const [tasks, setTasks]            = useStorage('lifeos_v3_tasks', SEED_TASKS)
  const [journalEntries, setJournal] = useStorage('lifeos_v3_journal', [])
  const [tab, setTab]                = useState('tasks')
  const [remindersOn, setRemindersOn] = useStorage('lifeos_reminders_v3', true)

  const { toasts, add: addToast, remove: removeToast } = useToasts()
  const { schedule, cancel } = useTaskReminders(addToast)
  useDailyReminders(addToast, remindersOn)

  // Reschedule on mount
  useEffect(() => {
    tasks.forEach(t => {
      if (t.notifyAt && t.notifyAt > Date.now() && !t.done) schedule(t, t.notifyAt - Date.now())
    })
  }, [])

  // Recurring reset daily
  useEffect(() => {
    const today = new Date().toDateString()
    const last  = localStorage.getItem('lifeos_reset_v3')
    if (last === today) return
    localStorage.setItem('lifeos_reset_v3', today)
    setTasks(p => p.map(t => t.recurring && t.done ? { ...t, done: false, ts: Date.now() } : t))
  }, [])

  function importTasks(extracted) {
    const newTasks = extracted.map(t => ({
      id: _iid++, title: t.title, area: t.area || 'Other',
      priority: t.priority || 'medium', done: false, ts: Date.now(),
      notifyAt: null, note: t.note || '', recurring: null, dueDate: null,
    }))
    setTasks(p => [...newTasks, ...p])
    setTab('tasks')
    addToast('OPS IMPORTED', `${newTasks.length} operations added to board`, '✦', 'var(--signal)')
  }

  const total = tasks.length
  const done  = tasks.filter(t => t.done).length

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Toasts toasts={toasts} remove={removeToast} />

      <Header total={total} done={done} remindersOn={remindersOn} setRemindersOn={setRemindersOn} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tab === 'tasks'   && <TasksTab tasks={tasks} setTasks={setTasks} schedule={schedule} cancel={cancel} addToast={addToast} />}
        {tab === 'journal' && <JournalTab entries={journalEntries} setEntries={setJournal} />}
        {tab === 'ai'      && <AITab tasks={tasks} journalEntries={journalEntries} addToast={addToast} />}
        {tab === 'stats'   && <StatsTab tasks={tasks} journalEntries={journalEntries} />}
        {tab === 'capture' && <CaptureTab onImport={importTasks} />}
        {tab === 'roadmap' && <RoadmapTab />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
