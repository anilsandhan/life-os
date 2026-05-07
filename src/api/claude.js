// src/api/claude.js
// In production: calls your own /api/claude Vercel serverless function
// In dev: calls Vercel dev server (or mock)

export async function askClaude(system, userMessage) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, message: userMessage })
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.text || ''
}
