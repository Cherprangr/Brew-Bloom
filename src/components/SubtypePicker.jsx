import Flower from './Flower'
import TopBar from './TopBar'
import { subtypes } from '../data/gardenData'

export default function SubtypePicker({ drink, onPick, onBack }) {
  return (
    <div className="scr active">
      <TopBar step={2} onBack={onBack} />
      <div className="title-row">★ {drink.toUpperCase()} ★</div>
      <div className="sub-row">EACH ONE WAKES A DIFFERENT BLOOM</div>
      <div className="btnrow">
        {subtypes[drink].map((s) => (
          <button key={s} className="pbtn" onClick={() => onPick(s)}>
            <Flower
              drink={drink}
              sub={s}
              scale={0.6}
              withStem={false}
              cx={35}
              cy={35}
              width={30}
              height={30}
              viewBox="0 0 70 70"
            />
            <span>{s.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
