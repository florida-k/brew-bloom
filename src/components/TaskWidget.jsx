/* "Today's table" — the task list beside the timer.
   Uses the same tasks as the Task Garden (useTasks), so tasks are { id, title, done }. */

import { useState } from 'react'

export default function TaskWidget({ tasks, onAdd, onToggle }) {
  const [text, setText] = useState('')
  const doneCount = tasks.filter((task) => task.done).length
  const percent = tasks.length ? (doneCount / tasks.length) * 100 : 0

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <aside className="task-widget">
      <div className="table-head">
        <h2>Today’s table</h2>
        <span className="table-count">
          {doneCount}/{tasks.length} DONE
        </span>
      </div>

      <div className="table-progress">
        <span style={{ width: `${percent}%` }} />
      </div>

      {tasks.length === 0 ? (
        <p className="table-empty">Nothing on the table yet. What’s one thing you want to get done?</p>
      ) : (
        <ul className="table-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                className={task.done ? 'table-item is-done' : 'table-item'}
                onClick={() => onToggle(task.id)}
              >
                <span className="table-check">{task.done ? '✓' : ''}</span>
                <span className="table-text">{task.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="table-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task…"
          aria-label="New task"
          maxLength={120}
        />
        <button type="submit" aria-label="Add task">+</button>
      </form>
    </aside>
  )
}