/* sets up the timer for the brewing screen */

import { useEffect, useState } from 'react'
import Cup from '../components/Cup'

// Focus for 10 seconds for testing 
const FOCUS_SECONDS = 1 * 10

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function Brewing({ drink, onBack, onFinish }) {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)
  const finished = secondsLeft === 0
  const progress = 1 - secondsLeft / FOCUS_SECONDS

  useEffect(() => {
    if (!running || finished) return

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => clearInterval(id)
  }, [running, finished])

  return (
    <main>
      <h1>{drink.name}</h1>
      <Cup color={drink.color} progress={progress} />
      <p className="timer">{formatTime(secondsLeft)}</p>

      {finished ? (
        <button className="primary" onClick={() => onFinish(FOCUS_SECONDS)}>
          Get my receipt
        </button>
      ) : (
        <button className="primary" onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Start focus'}
        </button>
      )}

      <button onClick={onBack}>Back</button>
    </main>
  )
}