// Builds the inner SVG markup (petals, center, optional stem) for a given
// flower species. Returns a string of raw SVG elements meant to be used
// with dangerouslySetInnerHTML inside a <g> or <svg>, since the petal count
// and geometry varies per species and is easiest to generate procedurally.

export function drawSpeciesShape(species, scale, petalCol, petalCol2, centerCol, cx, cy) {
  let s = ''

  if (species === 'lily') {
    const n = 6
    const rOuter = 34 * scale
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i - 90
      const rad = (ang * Math.PI) / 180
      const tipX = cx + Math.cos(rad) * rOuter
      const tipY = cy + Math.sin(rad) * rOuter * 1.15
      const midX = cx + Math.cos(rad) * rOuter * 0.6
      const midY = cy + Math.sin(rad) * rOuter * 0.6
      const perpX = Math.cos(rad + Math.PI / 2) * 7.5 * scale
      const perpY = Math.sin(rad + Math.PI / 2) * 7.5 * scale
      s += `<path d="M${cx},${cy} Q${cx + perpX * 1.4},${cy + perpY * 1.4} ${midX + perpX},${midY + perpY} Q${tipX},${tipY} ${midX - perpX},${midY - perpY} Q${cx - perpX * 1.4},${cy - perpY * 1.4} ${cx},${cy} Z" fill="${petalCol}" stroke="#1a1a1a" stroke-width="1"/>`
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${8 * scale}" fill="${centerCol}" stroke="#1a1a1a" stroke-width="1"/>`
  } else if (species === 'daisy') {
    const n = 9
    const rOuter = 29 * scale
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i
      const rad = (ang * Math.PI) / 180
      const tipX = cx + Math.cos(rad) * rOuter
      const tipY = cy + Math.sin(rad) * rOuter
      const w1 = Math.cos(rad + Math.PI / 2) * 6 * scale
      const w1y = Math.sin(rad + Math.PI / 2) * 6 * scale
      s += `<path d="M${cx + w1},${cy + w1y} Q${tipX},${tipY - 3 * scale} ${cx - w1},${cy - w1y} Q${cx},${cy + 3 * scale} ${cx + w1},${cy + w1y} Z" fill="${petalCol}" stroke="#1a1a1a" stroke-width="0.8"/>`
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${10 * scale}" fill="${centerCol}" stroke="#1a1a1a" stroke-width="1"/>`
  } else if (species === 'thistle') {
    const n = 13
    const rOuter = 24 * scale
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i
      const rad = (ang * Math.PI) / 180
      const x1 = cx + Math.cos(rad) * 7 * scale
      const y1 = cy + Math.sin(rad) * 7 * scale
      const x2 = cx + Math.cos(rad) * rOuter
      const y2 = cy + Math.sin(rad) * rOuter
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${petalCol}" stroke-width="3.4" stroke-linecap="round"/>`
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${10 * scale}" fill="${centerCol}" stroke="#1a1a1a" stroke-width="1"/>`
  } else if (species === 'starbloom') {
    const n = 6
    const rOuter = 30 * scale
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i
      const rad = (ang * Math.PI) / 180
      const tipX = cx + Math.cos(rad) * rOuter
      const tipY = cy + Math.sin(rad) * rOuter
      const b1 = rad - 0.3
      const b2 = rad + 0.3
      const bx1 = cx + Math.cos(b1) * 7.5 * scale
      const by1 = cy + Math.sin(b1) * 7.5 * scale
      const bx2 = cx + Math.cos(b2) * 7.5 * scale
      const by2 = cy + Math.sin(b2) * 7.5 * scale
      s += `<polygon points="${bx1},${by1} ${tipX},${tipY} ${bx2},${by2}" fill="${petalCol}" stroke="#1a1a1a" stroke-width="0.8"/>`
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${6 * scale}" fill="${centerCol}" stroke="#1a1a1a" stroke-width="1"/>`
  } else if (species === 'peony') {
    for (let layer = 0; layer < 2; layer++) {
      const rr = (21 - layer * 4.5) * scale
      const offset = layer * 22
      const count = 6
      for (let i = 0; i < count; i++) {
        const ang = (360 / count) * i + offset
        const rad = (ang * Math.PI) / 180
        const px = cx + Math.cos(rad) * rr * 0.55
        const py = cy + Math.sin(rad) * rr * 0.55
        const col = layer === 0 ? petalCol2 : petalCol
        s += `<circle cx="${px}" cy="${py}" r="${7.5 * scale}" fill="${col}" stroke="#1a1a1a" stroke-width="0.7" opacity="0.92"/>`
      }
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${6 * scale}" fill="${centerCol}" stroke="#1a1a1a" stroke-width="1"/>`
  }

  return s
}

// Full flower markup including an optional stem, given a drink + subtype
// (used to look up species + colors) and a draw scale/position.
export function flowerSVG(drink, sub, scale, withStem, cx, cy, speciesMeta, colorMap) {
  const species = speciesMeta[drink]
  const c = colorMap[sub] || { petal: '#9fcaa0', petal2: '#c0e0c0', center: '#5a8a5a' }
  let stem = ''
  if (withStem) {
    stem = `<rect x="${cx - 3}" y="${cy + 8}" width="6" height="${40 * scale}" fill="#2a5a0a"/>`
  }
  return `${stem}${drawSpeciesShape(species, scale, c.petal, c.petal2, c.center, cx, cy)}`
}
