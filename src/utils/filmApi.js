// Calls the Anthropic API to get a film suggestion that pairs with the
// chosen drink + mood archetype.
//
// IMPORTANT: this calls the Anthropic API directly from the browser using
// a user-supplied API key (stored only in memory/localStorage on this
// device). That's fine for local development and personal use, but an API
// key in client-side code is visible to anyone who opens dev tools, so
// don't ship this as-is to a public site. For a real deployment, move this
// fetch into a small backend/serverless function that holds the key
// server-side, and call that endpoint from here instead.

export async function fetchFilmSuggestion({ apiKey, drink, sub, archetype }) {
  const prompt = `You are a quirky film matchmaker in a retro pixel game. Drink: ${sub} (${drink}). Mood archetype: ${archetype}. Step 1: silently decide a movie genre that fits this archetype. Step 2: pick ONE specific real film in that genre that pairs with this drink's personality. Respond ONLY with raw JSON, no markdown, no backticks, no extra text before or after the JSON:
{"genre":"Genre name","title":"Film Title (Year)","story":"A brief 2 sentence story overview of the film, max 40 words total","why":"One short sentence on why it pairs with this archetype and drink, max 18 words"}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`HTTP ${res.status}: ${errBody.slice(0, 200)}`)
  }

  const data = await res.json()
  const textBlock = data.content.find((b) => b.type === 'text')
  if (!textBlock) {
    throw new Error('No text block in response: ' + JSON.stringify(data).slice(0, 200))
  }

  let raw = textBlock.text || '{}'
  let clean = raw.replace(/```json|```/g, '').trim()
  const jsonMatch = clean.match(/\{[\s\S]*\}/)
  if (jsonMatch) clean = jsonMatch[0]

  return JSON.parse(clean)
}
