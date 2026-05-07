// api/claude.js  — Vercel serverless function
// Deploy to Vercel, set ANTHROPIC_API_KEY in Environment Variables

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { system, message } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: system || 'You are a helpful assistant.',
        messages: [{ role: 'user', content: message }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return res.status(200).json({ text })
  } catch (err) {
    console.error('Claude API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
