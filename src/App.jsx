import { useState } from 'react'
import ApiKeyGate from './components/ApiKeyGate'
import DrinkPicker from './components/DrinkPicker'
import SubtypePicker from './components/SubtypePicker'
import WateringStage from './components/WateringStage'
import BloomResult from './components/BloomResult'

// Screens: 'gate' -> 'drink' -> 'sub' -> 'water' -> 'result'
export default function App() {
  const [screen, setScreen] = useState('gate')
  const [apiKey, setApiKey] = useState(localStorage.getItem('brewAndBloomApiKey') || '')
  const [drink, setDrink] = useState(null)
  const [sub, setSub] = useState(null)

  function saveApiKey(value) {
    setApiKey(value)
    localStorage.setItem('brewAndBloomApiKey', value)
  }

  function resetAll() {
    setDrink(null)
    setSub(null)
    setScreen('drink')
  }

  return (
    <div className="gb">
      <div className="screen-wrap">
        <div className="scanlines" />

        {screen === 'gate' && (
          <ApiKeyGate apiKey={apiKey} onSave={saveApiKey} onEnter={() => setScreen('drink')} />
        )}

        {screen === 'drink' && (
          <DrinkPicker
            onPick={(d) => {
              setDrink(d)
              setScreen('sub')
            }}
          />
        )}

        {screen === 'sub' && (
          <SubtypePicker
            drink={drink}
            onBack={() => setScreen('drink')}
            onPick={(s) => {
              setSub(s)
              setScreen('water')
            }}
          />
        )}

        {screen === 'water' && (
          <WateringStage
            drink={drink}
            sub={sub}
            onBack={() => setScreen('sub')}
            onDone={() => setScreen('result')}
          />
        )}

        {screen === 'result' && (
          <BloomResult drink={drink} sub={sub} apiKey={apiKey} onBack={resetAll} />
        )}
      </div>
    </div>
  )
}
