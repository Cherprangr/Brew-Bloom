import { drawSpeciesShape } from '../utils/flowerArt'
import { speciesMeta, colorMap } from '../data/gardenData'

// Neutral sandy tones used for the top-level drink picker, before a
// subtype (and therefore a real color) has been chosen.
const NEUTRAL = { petal: '#8a6a2a', petal2: '#a88840', center: '#5a4218' }

// Renders a single flower as an inline SVG fragment. Used everywhere a
// flower needs to show up: drink picker icons, subtype icons, the growing
// animation, and the final bloom result.
export default function Flower({ drink, sub, scale = 1, withStem = false, cx, cy, width, height, viewBox }) {
  const species = speciesMeta[drink]
  const c = sub ? colorMap[sub] || NEUTRAL : NEUTRAL

  let stem = ''
  if (withStem) {
    stem = `<rect x="${cx - 3}" y="${cy + 8}" width="6" height="${40 * scale}" fill="#2a5a0a"/>`
  }
  const markup = stem + drawSpeciesShape(species, scale, c.petal, c.petal2, c.center, cx, cy)

  return (
    <svg width={width} height={height} viewBox={viewBox}>
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  )
}
