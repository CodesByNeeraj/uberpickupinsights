import { useState, useEffect } from 'react'

const TIMER_START = 15

const INSIGHTS = [
  {
    id: 'entrance',
    icon: '🏢',
    label: 'Entrance hard to find',
    color: '#FF8C42',
    bg: 'rgba(255,140,66,0.12)',
    border: 'rgba(255,140,66,0.3)',
  },
  {
    id: 'no_stop',
    icon: '🚫',
    label: 'No stopping zone',
    color: '#FF4444',
    bg: 'rgba(255,68,68,0.10)',
    border: 'rgba(255,68,68,0.3)',
  },
  {
    id: 'traffic',
    icon: '🚦',
    label: 'Heavy event traffic',
    color: '#FFC107',
    bg: 'rgba(255,193,7,0.10)',
    border: 'rgba(255,193,7,0.3)',
  },
]

export default function PickupInsightsView() {
  const [timeLeft, setTimeLeft] = useState(TIMER_START)
  const [status, setStatus]     = useState('pending') // pending | accepted | declined | expired

  useEffect(() => {
    if (status !== 'pending') return
    if (timeLeft <= 0) { setStatus('expired'); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, status])

  const reset = () => { setStatus('pending'); setTimeLeft(TIMER_START) }

  // ── Post-action screens ──────────────────────────────────
  if (status !== 'pending') {
    const accepted = status === 'accepted'
    return (
      <div style={{ ...s.page, justifyContent: 'center', alignItems: 'center' }}>
        <div style={s.statusScreen}>
          <div style={{ ...s.statusIcon, background: accepted ? '#00d632' : '#1e1e1e' }}>
            {accepted ? '✓' : '✕'}
          </div>
          <h2 style={s.statusTitle}>
            {accepted ? 'Ride Accepted' : status === 'declined' ? 'Ride Declined' : 'Request Expired'}
          </h2>
          <p style={s.statusSub}>
            {accepted ? 'Navigate to pickup location' : 'Waiting for next ride request…'}
          </p>
          <button style={s.resetBtn} onClick={reset}>← Back</button>
        </div>
      </div>
    )
  }

  // ── Timer ring ───────────────────────────────────────────
  const pct   = timeLeft / TIMER_START
  const color = pct > 0.5 ? '#00d632' : pct > 0.25 ? '#FFA500' : '#FF4444'
  const R     = 17
  const circ  = 2 * Math.PI * R

  // ── Ride request screen ──────────────────────────────────
  return (
    <div style={s.page}>

      {/* Simulated map */}
      <div style={s.map}>
        <div style={s.mapGrid} />
        <div style={s.roadH} />
        <div style={s.roadV} />
        <div style={s.roadH2} />

        {/* Driver dot */}
        <div style={s.driverDot}>
          <div style={s.driverInner} />
        </div>

        {/* Pickup pin */}
        <div style={s.pinWrap}>
          <div className="pin-pulse" style={s.pinPulse} />
          <div style={s.pin} />
        </div>

        {/* Countdown timer */}
        <div style={s.timerWrap}>
          <svg width={42} height={42} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle cx={21} cy={21} r={R} fill="none" stroke="#2a2a2a" strokeWidth={3} />
            <circle
              cx={21} cy={21} r={R}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeDasharray={`${circ * pct} ${circ}`}
              strokeLinecap="round"
            />
          </svg>
          <span style={{ ...s.timerNum, color }}>{timeLeft}</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={s.sheet}>
        <div style={s.handle} />

        {/* Fare row */}
        <div style={s.fareRow}>
          <div>
            <span style={s.fare}>$14.80</span>
            <span style={s.fareType}> · UberX</span>
          </div>
          <div style={s.distPill}>6.2 mi · 22 min</div>
        </div>

        {/* Route */}
        <div style={s.route}>
          <div style={s.routeItem}>
            <div style={{ ...s.dot, background: '#00d632' }} />
            <div>
              <span style={s.routeTag}>PICKUP</span>
              <p style={s.routeAddr}>720 Market St, Financial District</p>
            </div>
          </div>
          <div style={s.connector} />
          <div style={s.routeItem}>
            <div style={{ ...s.dot, background: '#444' }} />
            <div>
              <span style={s.routeTag}>DROPOFF</span>
              <p style={s.routeAddr}>SFO Terminal 2, International Arrivals</p>
            </div>
          </div>
        </div>

        {/* Pickup Insights card */}
        <div style={s.insightsCard}>
          <div style={s.insightsHeader}>
            <div style={s.insightsTitleRow}>
              <span style={s.warnIcon}>⚠️</span>
              <span style={s.insightsTitle}>Pickup Insights</span>
            </div>
            <span style={s.reportsTag}>14 driver reports</span>
          </div>
          <div style={s.chipList}>
            {INSIGHTS.map(ins => (
              <div
                key={ins.id}
                style={{ ...s.chip, background: ins.bg, borderColor: ins.border }}
              >
                <span style={s.chipIcon}>{ins.icon}</span>
                <span style={{ ...s.chipLabel, color: ins.color }}>{ins.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accept / Decline */}
        <div style={s.actions}>
          <button style={s.declineBtn} onClick={() => setStatus('declined')}>
            Decline
          </button>
          <button style={s.acceptBtn} onClick={() => setStatus('accepted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    background: '#000',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  // Map
  map: {
    height: 205,
    background: '#0d1117',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  mapGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '28px 28px',
  },
  roadH: {
    position: 'absolute',
    left: 0, right: 0, top: 90,
    height: 14,
    background: 'rgba(255,255,255,0.05)',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  roadH2: {
    position: 'absolute',
    left: 0, right: 0, top: 155,
    height: 8,
    background: 'rgba(255,255,255,0.03)',
  },
  roadV: {
    position: 'absolute',
    top: 0, bottom: 0, left: 130,
    width: 12,
    background: 'rgba(255,255,255,0.05)',
  },

  // Driver dot
  driverDot: {
    position: 'absolute',
    left: 72, top: 118,
    width: 18, height: 18,
    borderRadius: '50%',
    background: '#2563EB',
    border: '2.5px solid #fff',
    boxShadow: '0 0 0 4px rgba(37,99,235,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  driverInner: {
    width: 6, height: 6,
    borderRadius: '50%',
    background: '#fff',
  },

  // Pickup pin
  pinWrap: {
    position: 'absolute',
    right: 95, top: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pinPulse: {
    position: 'absolute',
    width: 38, height: 38,
    borderRadius: '50%',
    background: 'rgba(0,214,50,0.15)',
    animation: 'pinPulse 1.8s ease-out infinite',
  },
  pin: {
    width: 14, height: 14,
    borderRadius: '50%',
    background: '#00d632',
    border: '3px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    zIndex: 1,
  },

  // Timer
  timerWrap: {
    position: 'absolute',
    top: 12, right: 12,
    width: 42, height: 42,
    background: '#000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  timerNum: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },

  // Sheet
  sheet: {
    flex: 1,
    background: '#111',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: '12px 18px 20px',
    marginTop: -18,
  },
  handle: {
    width: 36, height: 4,
    background: '#2a2a2a',
    borderRadius: 2,
    margin: '0 auto 16px',
  },

  fareRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  fare: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: -0.5,
  },
  fareType: {
    fontSize: 14,
    color: '#555',
    fontWeight: 500,
  },
  distPill: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#999',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 20,
  },

  // Route
  route: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #1e1e1e',
  },
  routeItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  connector: {
    width: 1,
    height: 10,
    background: '#2a2a2a',
    marginLeft: 6,
    marginTop: 3,
    marginBottom: 3,
  },
  dot: {
    width: 13, height: 13,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 3,
  },
  routeTag: {
    fontSize: 10,
    color: '#444',
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  routeAddr: {
    fontSize: 13,
    color: '#bbb',
    fontWeight: 500,
    lineHeight: 1.3,
    marginTop: 1,
  },

  // Insights card
  insightsCard: {
    background: '#0a180a',
    border: '1px solid rgba(0,214,50,0.15)',
    borderRadius: 14,
    padding: '13px 14px',
    marginBottom: 14,
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  insightsTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  warnIcon: { fontSize: 14 },
  insightsTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#fff',
  },
  reportsTag: {
    fontSize: 11,
    color: '#00d632',
    fontWeight: 600,
    background: 'rgba(0,214,50,0.1)',
    padding: '2px 8px',
    borderRadius: 10,
  },
  chipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 10px',
    borderRadius: 9,
    border: '1px solid',
  },
  chipIcon: { fontSize: 13 },
  chipLabel: {
    fontSize: 12,
    fontWeight: 600,
  },

  // Actions
  actions: {
    display: 'flex',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    padding: '15px',
    borderRadius: 12,
    border: '2px solid #252525',
    background: '#1a1a1a',
    color: '#777',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  acceptBtn: {
    flex: 2,
    padding: '15px',
    borderRadius: 12,
    border: 'none',
    background: '#00d632',
    color: '#000',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // Status screens
  statusScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    textAlign: 'center',
  },
  statusIcon: {
    width: 72, height: 72,
    borderRadius: '50%',
    fontSize: 30,
    fontWeight: 700,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
  },
  statusSub: {
    fontSize: 14,
    color: '#555',
    marginBottom: 32,
  },
  resetBtn: {
    padding: '12px 32px',
    borderRadius: 12,
    border: '1px solid #2a2a2a',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
