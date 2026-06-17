import { useEffect, useRef, useState } from 'react'
import Flower from './Flower'
import { archetypes } from '../data/gardenData'
import { fetchFilmSuggestion } from '../utils/filmApi'

function useTypewriter() {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const cancelRef = useRef(false)

  async function type(fullText, speed = 16) {
    cancelRef.current = false
    setShowCursor(true)
    for (let i = 1; i <= fullText.length; i++) {
      if (cancelRef.current) return
      setText(fullText.slice(0, i))
      await new Promise((r) => setTimeout(r, speed))
    }
    setShowCursor(false)
  }

  function cancel() {
    cancelRef.current = true
  }

  return { text, showCursor, type, cancel }
}

export default function BloomResult({ drink, sub, apiKey, onBack }) {
  const archetype = archetypes[sub] || 'THE MYSTERY SOUL'
  const { text, showCursor, type } = useTypewriter()
  const [film, setFilm] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function runFetch() {
    setFilm(null)
    setError(null)
    setLoading(true)
    await type('Searching the reel garden for your film...', 14)

    if (!apiKey) {
      setError('Add your Anthropic API key to get film picks.')
      setLoading(false)
      return
    }

    try {
      const result = await fetchFilmSuggestion({ apiKey, drink, sub, archetype })
      setFilm(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drink, sub])

  return (
    <div className="scr active">
      <div className="topbar">
        <button className="backbtn" onClick={onBack}>{'< NEW DRINK'}</button>
        <div className="pip-row">
          <div className="pip on" /><div className="pip on" /><div className="pip on" /><div className="pip on" />
        </div>
      </div>
      <div className="title-row">★ IN FULL BLOOM ★</div>
      <div className="sub-row">{sub.toUpperCase()} · {drink.toUpperCase()}</div>
      <div className="stage">
        <div className="sprite-box">
          <Flower
            drink={drink}
            sub={sub}
            scale={0.95}
            withStem={true}
            cx={80}
            cy={70}
            width={160}
            height={180}
            viewBox="0 0 160 180"
          />
          <div className="sprite-name">{archetype}</div>
        </div>
        <div className="dialog-box">
          <div className="dialog-text">
            {!film && !error && (
              <>
                {text}
                {showCursor && <span className="blink">_</span>}
              </>
            )}
            {film && (
              <>
                <span className="genre-tag">{film.genre}</span>
                <div className="film-title-box" style={{ marginTop: 8 }}>{film.title}</div>
                <div style={{ marginBottom: 6 }}>{film.story}</div>
                <div style={{ color: '#2a4a1a', fontWeight: 'bold' }}>★ {film.why}</div>
              </>
            )}
            {error && <div>Connection lost in the garden...</div>}
          </div>
          {error && <div className="errtext">Error: {error}</div>}
          {!loading && (film || error) && (
            <button className="again-btn" onClick={runFetch}>
              ⟳ POUR ANOTHER
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
