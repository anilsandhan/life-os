// src/hooks/useReminders.js
import { useEffect, useRef, useCallback } from 'react'
import { FIXED_REMINDERS } from '../constants'

export function useDailyReminders(addToast, enabled) {
  const fired = useRef({})

  useEffect(() => {
    if (!enabled) return
    const tick = setInterval(() => {
      const now = new Date()
      FIXED_REMINDERS.forEach(r => {
        const key = `${r.id}-${now.toDateString()}`
        if (now.getHours() === r.hour && now.getMinutes() === r.min && !fired.current[key]) {
          fired.current[key] = true
          addToast(r.title, r.body, r.icon, r.color, 10000)
          // Also try native push if permission granted
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification(`${r.icon} ${r.title}`, { body: r.body, tag: r.id })
          }
        }
      })
    }, 20000)
    return () => clearInterval(tick)
  }, [enabled, addToast])
}

export function useTaskReminders(addToast) {
  const timers = useRef({})

  const schedule = useCallback((task, ms) => {
    if (timers.current[task.id]) clearTimeout(timers.current[task.id])
    if (ms <= 0) return
    timers.current[task.id] = setTimeout(() => {
      addToast(
        task.title.length > 48 ? task.title.slice(0, 48) + '…' : task.title,
        `[${task.priority.toUpperCase()}] ${task.area} · Reminder`,
        '⏰', '#facc15', 10000
      )
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('⏰ Task Reminder', { body: task.title, tag: `task-${task.id}` })
      }
    }, ms)
  }, [addToast])

  const cancel = useCallback((id) => {
    if (timers.current[id]) { clearTimeout(timers.current[id]); delete timers.current[id] }
  }, [])

  return { schedule, cancel }
}
