/* Imports from list of drinks (drinks.js) and makes them 
selectable 

Allows you to brew and transitions to brewing screen

Imports brewing screen
*/


import { useState } from 'react'
import './App.css'
import { DRINKS } from './data/drinks'
import Brewing from './screens/Brewing'

function App() {
  const [screen, setScreen] = useState('pick')
  const [selectedId, setSelectedId] = useState(DRINKS[0].id)
  const drink = DRINKS.find((d) => d.id === selectedId)

  if (screen === 'brew') {
  return <Brewing drink={drink} onBack={() => setScreen('pick')} />
  }

  return (
    <main>
      <h1>What are you drinking while you focus?</h1>

      <div className="drink-list">
        {DRINKS.map((d) => (
          <button
            key={d.id}
            className={d.id === selectedId ? 'card selected' : 'card'}
            onClick={() => setSelectedId(d.id)}
          >
            <strong>{d.name}</strong>
            <div></div>
            <span>{d.note}</span>
            <div></div>
            <span>{d.caffeine} mg caffeine</span>
          </button>
        ))}
      </div>

      <button className="primary" onClick={() => setScreen('brew')}>
        Brew my {drink.name.toLowerCase()}
      </button>
    </main>
  )
}

export default App