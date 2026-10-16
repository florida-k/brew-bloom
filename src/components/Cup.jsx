/* brewing screen cup component, this file handles the visual representation of the cup during brewing */

export default function Cup({ color, progress }) {
  return (
    <div
      className="cup"
      role="img"
      aria-label={`Cup ${Math.round(progress * 100)}% full`}
    >
      <div
        className="cup-liquid"
        style={{ height: `${progress * 100}%`, background: color }}
      />
    </div>
  )
}