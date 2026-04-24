import { useState } from 'react';
import UberOfferCard from './UberOfferCard';

const DEMO_STATES = [
  {
    label: 'No insight',
    description: 'Card identical to original',
    insights: [],
  },
  {
    label: 'Amber — single',
    description: 'One friction issue',
    insights: [
      { label: 'Entrance hard to find', severity: 'amber', count: 8 },
    ],
  },
  {
    label: 'Red — single',
    description: 'One legal/safety issue',
    insights: [
      { label: 'No stopping zone', severity: 'red', count: 11 },
    ],
  },
  {
    label: 'Multiple (+2)',
    description: 'Top issue shown, +2 suffix, expandable',
    insights: [
      { label: 'Entrance hard to find', severity: 'amber', count: 8 },
      { label: 'No stopping zone', severity: 'red', count: 4 },
      { label: 'Pickup spot usually crowded', severity: 'amber', count: 3 },
    ],
  },
];

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = DEMO_STATES[activeIdx];

  return (
    <div className="flex flex-col items-center gap-6 pb-10">
      <h1 className="text-lg font-bold text-gray-700 mt-2 tracking-tight">
        Uber Pickup Insights — Demo
      </h1>

      {/* Phone mockup */}
      <div
        style={{
          width: 390,
          height: 760,
          background: '#1a1a1a',
          borderRadius: '3rem',
          padding: '12px',
          boxSizing: 'border-box',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 16px 6px',
            color: '#fff',
            fontSize: 11,
            fontFamily: 'system-ui',
            fontWeight: 600,
          }}
        >
          <span>9:41</span>
          <span style={{ fontSize: 10 }}>●●● WiFi 🔋</span>
        </div>

        {/* Screen */}
        <div
          style={{
            borderRadius: '2.4rem',
            overflow: 'hidden',
            height: 'calc(100% - 28px)',
          }}
        >
          <UberOfferCard key={activeIdx} insights={active.insights} />
        </div>
      </div>

      {/* Toggle panel */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          padding: 16,
          width: 390,
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: '#9ca3af',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 10,
            fontFamily: 'system-ui',
          }}
        >
          Demo State
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {DEMO_STATES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: 12,
                border: activeIdx === i ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                background: activeIdx === i ? '#eff6ff' : '#f9fafb',
                color: activeIdx === i ? '#1d4ed8' : '#374151',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'system-ui',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, lineHeight: 1.3 }}>
                {s.description}
              </span>
            </button>
          ))}
        </div>
        <p
          style={{
            fontSize: 10,
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'system-ui',
          }}
        >
          Tap a badge in the card to expand the full breakdown
        </p>
      </div>
    </div>
  );
}
