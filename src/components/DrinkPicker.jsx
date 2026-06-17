import Flower from './Flower'
import TopBar from './TopBar'
import { speciesMeta } from '../data/gardenData'

export default function DrinkPicker({ onPick }) {
  return (
    <div className="scr active">
      <TopBar step={1} onBack={null} />
      <div className="title-row">★ THE CELLAR DOOR ★</div>
      <div className="sub-row">WHAT SHALL WE POUR TONIGHT?</div>
      <div className="btnrow">
        {Object.keys(speciesMeta).map((d) => (
          <button key={d} className="pbtn" onClick={() => onPick(d)}>
            <Flower
              drink={d}
              sub={null}
              scale={0.7}
              withStem={false}
              cx={35}
              cy={35}
              width={34}
              height={34}
              viewBox="0 0 70 70"
            />
            <span>{d.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
