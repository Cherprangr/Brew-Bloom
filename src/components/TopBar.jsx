export default function TopBar({ onBack, backLabel = '< BACK', step }) {
  return (
    <div className="topbar">
      <button className="backbtn" onClick={onBack} disabled={!onBack}>
        {backLabel}
      </button>
      <div className="pip-row">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`pip ${n <= step ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  )
}
