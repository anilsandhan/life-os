// api/claude.js — Vercel serverless function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { system, message } = req.body || {}
  if (!message) return res.status(400).json({ error: 'message required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in environment' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: system || 'You are a helpful assistant.',
        messages: [{ role: 'user', content: message }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data))
      return res.status(response.status).json({ error: data?.error?.message || 'Anthropic API error' })
    }

    const text = data.content?.[0]?.text || ''
    return res.status(200).json({ text })

  } catch (err) {
    console.error('Claude API error:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}