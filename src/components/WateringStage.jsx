import { useState } from 'react'
import { drawSpeciesShape } from '../utils/flowerArt'
import { speciesMeta, colorMap } from '../data/gardenData'

const GROW_STAGES = [
  { scale: 0.32, withStem: false, cy: 120, label: 'a sprout appears...' },
  { scale: 0.68, withStem: true, cy: 95, label: 'growing taller...' },
  { scale: 1, withStem: true, cy: 65, label: 'in full bloom!' },
]

const STAGE_DELAY_MS = 650

export default function WateringStage({ drink, sub, onDone, onBack }) {
  // 'idle' | 'pouring' | 'growing' | 'done'
  const [phase, setPhase] = useState('idle')
  const [growStep, setGrowStep] = useState(-1)
  const [drops, setDrops] = useState([])

  async function startPour() {
    setPhase('pouring')

    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 170))
      setDrops((prev) => [...prev, { id: Date.now() + i, x: 98 + Math.random() * 4 }])
    }

    await new Promise((r) => setTimeout(r, 450))
    setPhase('growing')

    for (let i = 0; i < GROW_STAGES.length; i++) {
      setGrowStep(i)
      await new Promise((r) => setTimeout(r, STAGE_DELAY_MS))
    }

    setPhase('done')
    onDone()
  }

  const c = colorMap[sub]
  const species = speciesMeta[drink]
  const currentStage = growStep >= 0 ? GROW_STAGES[growStep] : null

  let flowerMarkup = ''
  if (currentStage) {
    const stem = currentStage.withStem
      ? `<rect x="${100 - 3}" y="${currentStage.cy + 8}" width="6" height="${40 * currentStage.scale}" fill="#2a5a0a"/>`
      : ''
    flowerMarkup = stem + drawSpeciesShape(species, currentStage.scale, c.petal, c.petal2, c.center, 100, currentStage.cy)
  }

  return (
    <div className="scr active">
      <div className="topbar">
        <button className="backbtn" onClick={onBack}>{'< BACK'}</button>
        <div className="pip-row">
          <div className="pip on" /><div className="pip on" /><div className="pip on" /><div className="pip" />
        </div>
      </div>
      <div className="title-row">★ THE WATERING ★</div>
      <div className="sub-row">POUR THE {sub.toUpperCase()} AND WATCH IT GROW</div>
      <div className="pourwrap">
        <svg width="200" height="220" viewBox="0 0 200 220">
          {phase === 'idle' && (
            <g style={{ cursor: 'pointer' }} onClick={startPour}>
              <rect x="72" y="20" width="42" height="24" rx="3" fill="#7a8a98" />
              <rect x="112" y="26" width="26" height="6" rx="2" fill="#7a8a98" transform="rotate(-15 112 29)" />
              <rect x="80" y="8" width="8" height="14" fill="#7a8a98" />
            </g>
          )}

          {phase === 'pouring' &&
            drops.map((d) => (
              <circle key={d.id} cx={d.x} cy="40" r="3" fill={c.water}>
                <animate attributeName="cy" from="40" to="185" dur="0.4s" fill="freeze" />
                <animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="freeze" />
              </circle>
            ))}

          {currentStage && <g dangerouslySetInnerHTML={{ __html: flowerMarkup }} />}

          <rect x="55" y="190" width="90" height="8" rx="2" fill="#9a7a3a" />
        </svg>
        <div className="pourtext">
          {phase === 'idle' && 'tap the can to begin'}
          {phase === 'pouring' && 'pouring...'}
          {currentStage && currentStage.label}
        </div>
      </div>
    </div>
  )
}
