// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Toasts } from './components/Toasts'
import { TasksTab } from './components/TasksTab'
import { AITab } from './components/AITab'
import { CaptureTab } from './components/CaptureTab'
import { useStorage } from './hooks/useStorage'
import { useToasts } from './hooks/useToasts'
import { useDailyReminders, useTaskReminders } from './hooks/useReminders'
import { SEED_TASKS } from './constants'

let _importId = 500

export default function App() {
  const [tasks, setTasks]           = useStorage('lifeos_tasks_v1', SEED_TASKS)
  const [tab, setTab]               = useState('tasks')
  const [remindersOn, setRemindersOn] = useStorage('lifeos_reminders', true)

  const { toasts, add: addToast, remove: removeToast } = useToasts()
  const { schedule, cancel }        = useTaskReminders(addToast)
  useDailyReminders(addToast, remindersOn)

  // Re-schedule task reminders on load
  useEffect(() => {
    tasks.forEach(t => {
      if (t.notifyAt && t.notifyAt > Date.now() && !t.done) {
        schedule(t, t.notifyAt - Date.now())
      }
    })
  }, [])

  function importTasks(extracted) {
    const newTasks = extracted.map(t => ({
      id: _importId++, title: t.title, area: t.area || 'Other',
      priority: t.priority || 'medium', done: false, ts: Date.now(), notifyAt: null
    }))
    setTasks(p => [...newTasks, ...p])
    setTab('tasks')
    addToast('IMPORTED', `${newTasks.length} tasks added`, '⬡', '#f97316')
  }

  const total = tasks.length
  const done  = tasks.filter(t => t.done).length

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Toasts toasts={toasts} remove={removeToast} />

      <Header
        total={total} done={done} tab={tab} setTab={setTab}
        remindersOn={remindersOn} setRemindersOn={setRemindersOn}
      />

      {/* Tab content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tab === 'tasks' && (
          <TasksTab tasks={tasks} setTasks={setTasks} schedule={schedule} cancel={cancel} addToast={addToast} />
        )}
        {tab === 'ai' && <AITab tasks={tasks} />}
        {tab === 'capture' && <CaptureTab onImport={importTasks} />}
      </div>
    </div>
  )
}
