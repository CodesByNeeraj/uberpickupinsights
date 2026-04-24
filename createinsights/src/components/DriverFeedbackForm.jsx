import { useState, useRef } from 'react'

const ISSUES = [
  { id: 'wrong_location', label: 'Wrong pickup location' },
  { id: 'heavy_traffic',  label: 'Heavy traffic' },
  { id: 'construction',   label: 'Construction area' },
  { id: 'no_stopping',    label: 'No Stopping / Waiting Zones' },
]

function scoreColor(n) {
  if (n <= 3) return '#ff4444'
  if (n <= 6) return '#ffa500'
  return '#00d632'
}

function scoreLabel(n) {
  if (n <= 3) return 'Difficult'
  if (n <= 6) return 'Moderate'
  return 'Easy'
}

export default function DriverFeedbackForm() {
  const [easeScore, setEaseScore]           = useState(5)
  const [locationAccurate, setLocationAccurate] = useState(null) // null | true | false
  const [selectedIssues, setSelectedIssues] = useState(new Set())
  const [comments, setComments]             = useState('')
  const [photos, setPhotos]                 = useState([])
  const [submitted, setSubmitted]           = useState(false)
  const fileInputRef = useRef(null)

  const toggleIssue = (id) => {
    setSelectedIssues(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
    }))
    setPhotos(prev => [...prev, ...previews])
    e.target.value = ''
  }

  const removePhoto = (id) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo) URL.revokeObjectURL(photo.url)
      return prev.filter(p => p.id !== id)
    })
  }

  const canSubmit = locationAccurate !== null
  const fillPct   = `${((easeScore - 1) / 9) * 100}%`

  // ── Success screen ───────────────────────────────────────
  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.successWrap}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successTitle}>Thanks for the feedback!</h2>
          <p style={s.successSub}>
            Your report helps improve pickup accuracy for all drivers.
          </p>
          <button style={s.doneBtn} onClick={() => setSubmitted(false)}>
            Done
          </button>
        </div>
      </div>
    )
  }

  // ── Feedback form ────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header}>
          <span style={s.badge}>Ride completed</span>
          <h1 style={s.pageTitle}>Rate your pickup</h1>
          <p style={s.pageSub}>Help improve pickup conditions for other drivers</p>
        </div>

        {/* ── Q1: Ease of finding rider ── */}
        <div style={s.card}>
          <div style={s.qMeta}>
            <span style={s.qNum}>1 / 3</span>
          </div>
          <h2 style={s.question}>
            On a scale of 1–10, how easy was it to find the rider?
          </h2>

          <div style={s.scoreRow}>
            <span style={{ ...s.scoreNum, color: scoreColor(easeScore) }}>
              {easeScore}
            </span>
            <span style={{ ...s.scoreTag, color: scoreColor(easeScore) }}>
              {scoreLabel(easeScore)}
            </span>
          </div>

          <div style={s.sliderWrap}>
            <input
              type="range"
              min={1}
              max={10}
              value={easeScore}
              className="uber-slider"
              style={{ '--fill': fillPct }}
              onChange={e => setEaseScore(Number(e.target.value))}
            />
          </div>

          <div style={s.sliderEndLabels}>
            <span style={s.endLabel}>1 · Very hard</span>
            <span style={s.endLabel}>10 · Very easy</span>
          </div>

          {/* Tick marks */}
          <div style={s.tickRow} aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <span
                key={n}
                style={{
                  ...s.tick,
                  color: n === easeScore ? scoreColor(easeScore) : '#3a3a3a',
                  fontWeight: n === easeScore ? 700 : 400,
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* ── Q2: Pickup location accurate ── */}
        <div style={s.card}>
          <div style={s.qMeta}>
            <span style={s.qNum}>2 / 3</span>
            <span style={s.requiredTag}>Required</span>
          </div>
          <h2 style={s.question}>Was the pickup location accurate?</h2>

          <div style={s.yesNoRow}>
            <button
              style={{
                ...s.yesNoBtn,
                ...(locationAccurate === true  ? s.yesActive  : {}),
                ...(locationAccurate === false ? s.yesInactive : {}),
              }}
              onClick={() => setLocationAccurate(true)}
            >
              Yes
            </button>
            <button
              style={{
                ...s.yesNoBtn,
                ...(locationAccurate === false ? s.noActive   : {}),
                ...(locationAccurate === true  ? s.noInactive : {}),
              }}
              onClick={() => setLocationAccurate(false)}
            >
              No
            </button>
          </div>
        </div>

        {/* ── Q3: Issues encountered ── */}
        <div style={s.card}>
          <div style={s.qMeta}>
            <span style={s.qNum}>3 / 3</span>
            <span style={s.optionalTag}>Optional</span>
          </div>
          <h2 style={s.question}>Were there any pickup issues encountered?</h2>
          <p style={s.hint}>Select all that apply</p>

          <div style={s.issuesList}>
            {ISSUES.map(issue => {
              const active = selectedIssues.has(issue.id)
              return (
                <button
                  key={issue.id}
                  style={{ ...s.issueRow, ...(active ? s.issueRowActive : {}) }}
                  onClick={() => toggleIssue(issue.id)}
                >
                  <span style={{ ...s.checkbox, ...(active ? s.checkboxActive : {}) }}>
                    {active && '✓'}
                  </span>
                  <span style={s.issueLabel}>{issue.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Optional: Comments + Photos ── */}
        <div style={s.card}>
          <div style={s.qMeta}>
            <span style={s.optionalTag}>Optional</span>
          </div>
          <h2 style={s.question}>Additional comments or photos</h2>

          <textarea
            style={s.textarea}
            placeholder="Describe the pickup experience…"
            value={comments}
            onChange={e => setComments(e.target.value)}
            rows={4}
          />

          <button
            style={s.photoBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={s.photoBtnIcon}>📷</span>
            Add photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />

          {photos.length > 0 && (
            <div style={s.photoGrid}>
              {photos.map(photo => (
                <div key={photo.id} style={s.thumbWrap}>
                  <img src={photo.url} alt="Upload preview" style={s.thumb} />
                  <button
                    style={s.removeBtn}
                    onClick={() => removePhoto(photo.id)}
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        {!canSubmit && (
          <p style={s.validationMsg}>Answer question 2 to continue</p>
        )}

        <button
          style={{ ...s.submitBtn, ...(!canSubmit ? s.submitDisabled : {}) }}
          onClick={() => canSubmit && setSubmitted(true)}
          disabled={!canSubmit}
        >
          Submit Feedback
        </button>

        <button style={s.skipBtn}>Skip for now</button>

      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 430,
    padding: '0 16px 48px',
  },

  // Header
  header: {
    padding: '36px 0 20px',
  },
  badge: {
    display: 'inline-block',
    background: '#1a1a1a',
    color: '#00d632',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSub: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.4,
  },

  // Card
  card: {
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: 16,
    padding: '22px 18px',
    marginBottom: 10,
  },
  qMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  qNum: {
    fontSize: 11,
    color: '#444',
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  requiredTag: {
    fontSize: 10,
    color: '#ff4444',
    background: 'rgba(255,68,68,0.1)',
    padding: '2px 8px',
    borderRadius: 10,
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  optionalTag: {
    fontSize: 10,
    color: '#555',
    background: '#1a1a1a',
    padding: '2px 8px',
    borderRadius: 10,
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  question: {
    fontSize: 17,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.35,
    marginBottom: 20,
  },
  hint: {
    fontSize: 13,
    color: '#555',
    marginTop: -14,
    marginBottom: 14,
  },

  // Slider Q1
  scoreRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 14,
  },
  scoreNum: {
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1,
    transition: 'color 0.2s',
    fontVariantNumeric: 'tabular-nums',
  },
  scoreTag: {
    fontSize: 15,
    fontWeight: 600,
    transition: 'color 0.2s',
  },
  sliderWrap: {
    marginBottom: 10,
  },
  sliderEndLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  endLabel: {
    fontSize: 11,
    color: '#444',
  },
  tickRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tick: {
    fontSize: 12,
    width: 20,
    textAlign: 'center',
    transition: 'color 0.1s, font-weight 0.1s',
  },

  // Yes / No Q2
  yesNoRow: {
    display: 'flex',
    gap: 10,
  },
  yesNoBtn: {
    flex: 1,
    padding: '16px',
    borderRadius: 12,
    border: '2px solid #252525',
    background: '#1a1a1a',
    color: '#777',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  yesActive: {
    background: '#00d632',
    borderColor: '#00d632',
    color: '#000',
  },
  yesInactive: {
    opacity: 0.4,
  },
  noActive: {
    background: '#ff4444',
    borderColor: '#ff4444',
    color: '#fff',
  },
  noInactive: {
    opacity: 0.4,
  },

  // Issues Q3
  issuesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  issueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 14px',
    borderRadius: 12,
    border: '2px solid #1e1e1e',
    background: '#181818',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  issueRowActive: {
    borderColor: '#00d632',
    background: 'rgba(0,214,50,0.07)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: '2px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'transparent',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  checkboxActive: {
    background: '#00d632',
    borderColor: '#00d632',
    color: '#000',
  },
  issueLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: 500,
  },

  // Optional section
  textarea: {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #252525',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    padding: '14px',
    outline: 'none',
    marginBottom: 12,
    lineHeight: 1.5,
    display: 'block',
  },
  photoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '13px',
    borderRadius: 12,
    border: '2px dashed #2a2a2a',
    background: 'transparent',
    color: '#666',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  },
  photoBtnIcon: {
    fontSize: 18,
  },
  photoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  thumbWrap: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  thumb: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 10,
    border: '1px solid #2a2a2a',
    display: 'block',
  },
  removeBtn: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#333',
    color: '#fff',
    border: '1.5px solid #000',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    fontFamily: 'inherit',
  },

  // Submit
  validationMsg: {
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 13,
    marginBottom: 10,
  },
  submitBtn: {
    width: '100%',
    padding: '18px',
    borderRadius: 12,
    border: 'none',
    background: '#00d632',
    color: '#000',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
    letterSpacing: 0.2,
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
  submitDisabled: {
    background: '#1a1a1a',
    color: '#333',
    cursor: 'not-allowed',
  },
  skipBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: 'none',
    color: '#444',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // Success
  successWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 32px',
    textAlign: 'center',
    maxWidth: 430,
    margin: '0 auto',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#00d632',
    color: '#000',
    fontSize: 36,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 10,
  },
  successSub: {
    fontSize: 15,
    color: '#666',
    lineHeight: 1.5,
    maxWidth: 280,
    marginBottom: 48,
  },
  doneBtn: {
    padding: '16px 56px',
    borderRadius: 12,
    border: 'none',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
