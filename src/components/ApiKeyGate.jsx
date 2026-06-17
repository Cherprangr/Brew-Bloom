import { useState } from 'react'

export default function ApiKeyGate({ apiKey, onSave, onEnter }) {
  const [value, setValue] = useState(apiKey)

  return (
    <div className="scr active">
      <div className="title-row">★ BREW &amp; BLOOM ★</div>
      <div className="sub-row">A FILM PAIRING GAME</div>
      <div className="apikeyrow">
        <label htmlFor="apikey">Anthropic API key</label>
        <input
          id="apikey"
          type="password"
          placeholder="sk-ant-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="apinote">
        Stored only in your browser (localStorage). Get a key at console.anthropic.com.
        You can skip this and add it later — the garden still works, just without film picks.
      </div>
      <div style={{ textAlign: 'center' }}>
        <button
          className="again-btn"
          onClick={() => {
            onSave(value)
            onEnter()
          }}
        >
          enter the cellar &rarr;
        </button>
      </div>
    </div>
  )
}
