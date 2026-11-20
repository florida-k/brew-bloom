/* sets up the timer for the brewing screen */

import { useEffect, useState } from 'react'
import TaskWidget from '../components/TaskWidget'
import { useTasks } from '../widgets/garden'

const RADIUS = 150
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
}

function formatClock(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function Brewing({ drink, minutes, onBack, onFinish }) {
  const totalSeconds = minutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState(null)
  const finished = secondsLeft === 0
  const progress = 1 - secondsLeft / totalSeconds

  // same task list as the Task Garden on the wellness page
  const { tasks, addTask, toggleTask } = useTasks()

  function toggleRunning() {
    setRunning((r) => !r)
    setStartedAt((prev) => prev ?? new Date()) // only remembers the FIRST start
  }

  // countdown
  useEffect(() => {
    if (!running || finished) return

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => clearInterval(id)
  }, [running, finished])

  // space bar pauses / unpauses (but not while typing a task)
  useEffect(() => {
    function handleKey(e) {
      if (e.code !== 'Space' || finished) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return
      e.preventDefault()
      setRunning((r) => !r)
      setStartedAt((prev) => prev ?? new Date())
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [finished])

  // where the glowing dot sits on the ring
  const angle = progress * 2 * Math.PI
  const dotX = 170 + RADIUS * Math.sin(angle)
  const dotY = 170 - RADIUS * Math.cos(angle)

  // "Ends at" is only known while the timer is running
  const endsAt = running ? formatClock(new Date(Date.now() + secondsLeft * 1000)) : '—'

  let status = 'READY WHEN YOU ARE'
  let message = 'Press start whenever you’re ready.'
  if (finished) {
    status = 'BREWED'
    message = 'Your cup is ready. Nice work.'
  } else if (running) {
    status = 'FOCUS SESSION IN PROGRESS'
    message = `Settle in. Your ${drink.name.toLowerCase()} is warm.`
  } else if (secondsLeft < totalSeconds) {
    status = 'PAUSED'
    message = 'Take a breath. Your cup will wait.'
  }

  return (
    <div className="cafe-page" style={{ '--drink-color': drink.color }}>
      <main className="picker">
        <div className="session-top">
          <span className="eyebrow">✳ STEP THREE · FOCUS</span>
          <span className={running ? 'session-status is-live' : 'session-status'}>
            <span className="status-dot" /> {status}
          </span>
        </div>

        <div className="session-layout">
          <section className={running ? 'session-card is-running' : 'session-card'}>
            <p className="eyebrow session-label">
              {drink.name.toUpperCase()} · {minutes} MIN
            </p>

            <div className="ring-wrap">
              <div className="ring-glow" />
              <svg className="ring" viewBox="0 0 340 340">
                <circle className="ring-face" cx="170" cy="170" r="140" />
                <circle className="ring-track" cx="170" cy="170" r={RADIUS} />
                <circle
                  className={finished ? 'ring-progress is-done' : 'ring-progress'}
                  cx="170"
                  cy="170"
                  r={RADIUS}
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                  transform="rotate(-90 170 170)"
                />
                {!finished && <circle className="ring-dot" cx={dotX} cy={dotY} r="8" />}
              </svg>

              <div className="ring-center">
                <p className="session-time">{formatTime(secondsLeft)}</p>
                <p className="session-message">{message}</p>
              </div>
            </div>

            <div className="session-actions">
              {finished ? (
                <button className="order-button" onClick={() => onFinish(totalSeconds)}>
                  Get my receipt →
                </button>
              ) : (
                <button className="order-button" onClick={toggleRunning}>
                  {running ? '❚❚ Pause' : '▶ Start focus'}
                </button>
              )}
              <button className="back-button" onClick={onBack}>
                ← Back
              </button>
            </div>
            {!finished && <p className="session-hint">SPACE TO {running ? 'PAUSE' : 'START'}</p>}
          </section>

          <div className="session-side">
            <TaskWidget tasks={tasks} onAdd={addTask} onToggle={toggleTask} />

            <section className="details-card">
              <span className="eyebrow">ON YOUR TABLE</span>
              <dl className="details-list">
                <div className="details-row">
                  <dt>Drink</dt>
                  <dd>
                    <span className="drink-dot" />
                    {drink.name}
                  </dd>
                </div>
                <div className="details-row">
                  <dt>Focus length</dt>
                  <dd>{minutes} min</dd>
                </div>
                <div className="details-row">
                  <dt>Started</dt>
                  <dd>{startedAt ? formatClock(startedAt) : '—'}</dd>
                </div>
                <div className="details-row">
                  <dt>Ends at</dt>
                  <dd>{endsAt}</dd>
                </div>
              </dl>
              <p className="details-quote">“A quiet page still counts as progress.”</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}