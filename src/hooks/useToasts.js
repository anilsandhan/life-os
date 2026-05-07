// src/hooks/useToasts.js
import { useState, useCallback } from 'react'

let _tid = 0

export function useToasts() {
  const [toasts, setToasts] = useState([])

  const add = useCallback((title, body, icon = '🔔', color = '#f97316', duration = 6000) => {
    const id = ++_tid
    setToasts(t => [...t, { id, title, body, icon, color, exiting: false }])
    setTimeout(() => {
      setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x))
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 320)
    }, duration)
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x))
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 320)
  }, [])

  return { toasts, add, remove }
}
