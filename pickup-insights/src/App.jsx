import { useState } from 'react';
import {
  Navigation,
  Users,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Plane,
} from 'lucide-react';
import UberOfferCard from './UberOfferCard';

// ─── Insight data ─────────────────────────────────────────────────────────────
// treatment A: frequency scale  |  treatment B: flat pop-out

const INSIGHTS = {
  entrance_medium: {
    label: 'Entrance hard to find',
    treatment: 'A',
    severity: 'amber',
    icon: Navigation,
    frequency: 'medium',
  },
  crowded_high: {
    label: 'Pickup spot usually crowded',
    treatment: 'A',
    severity: 'amber',
    icon: Users,
    frequency: 'high',
  },
  rider_low: {
    label: 'Rider often not ready',
    treatment: 'A',
    severity: 'amber',
    icon: Clock,
    frequency: 'low',
  },
  no_stop: {
    label: 'No stopping zone',
    treatment: 'B',
    severity: 'red',
    icon: ShieldAlert,
    description: 'Risk of ticket — consider double-parking briefly',
  },
  road_closed: {
    label: 'Road closed',
    treatment: 'B',
    severity: 'red',
    icon: AlertTriangle,
    description: 'Detour in effect, add 2–3 min',
  },
  gated: {
    label: 'Gated community',
    treatment: 'B',
    severity: 'amber',
    icon: Lock,
    description: 'Call rider for gate code on arrival',
  },
  airport: {
    label: 'Airport terminal',
    treatment: 'B',
    severity: 'neutral',
    icon: Plane,
    description: 'Check app for exact terminal before pulling up',
  },
};

// ─── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: 'None (no insight)',
    insights: [],
  },
  {
    label: 'Entrance hard to find — A, amber, medium',
    insights: [INSIGHTS.entrance_medium],
  },
  {
    label: 'Pickup spot usually crowded — A, amber, high',
    insights: [INSIGHTS.crowded_high],
  },
  {
    label: 'Rider often not ready — A, amber, low',
    insights: [INSIGHTS.rider_low],
  },
  {
    label: 'No stopping zone — B, red',
    insights: [INSIGHTS.no_stop],
  },
  {
    label: 'Road closed — B, red',
    insights: [INSIGHTS.road_closed],
  },
  {
    label: 'Gated community — B, amber',
    insights: [INSIGHTS.gated],
  },
  {
    label: 'Airport terminal — B, neutral',
    insights: [INSIGHTS.airport],
  },
  {
    label: 'Multiple issues stacked (+2)',
    insights: [INSIGHTS.no_stop, INSIGHTS.entrance_medium, INSIGHTS.crowded_high],
  },
  {
    label: 'Flash + Pickup Bonus stacked',
    insights: [INSIGHTS.entrance_medium],
    forceTier: 3,
  },
];

const TIERS = [
  { value: 0, label: 'None' },
  { value: 2, label: 'Tier 2  +$2' },
  { value: 3, label: 'Tier 3  +$4' },
  { value: 4, label: 'Tier 4  Surge' },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [scenarioIdx, setScenarioIdx]   = useState(0);
  const [incentiveTier, setIncentiveTier] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const activeTier = scenario.forceTier ?? incentiveTier;

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
          <UberOfferCard
            key={`${scenarioIdx}-${activeTier}`}
            insights={scenario.insights}
            incentiveTier={activeTier}
          />
        </div>
      </div>

      {/* Demo control panel */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          padding: 16,
          width: 390,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontFamily: 'system-ui',
        }}
      >
        {/* Scenario dropdown */}
        <div>
          <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
            Insight Scenario
          </p>
          <select
            value={scenarioIdx}
            onChange={(e) => setScenarioIdx(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 10,
              border: '1.5px solid #e5e7eb',
              background: '#f9fafb',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              fontFamily: 'system-ui',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SCENARIOS.map((s, i) => (
              <option key={i} value={i}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Incentive tier toggle */}
        <div>
          <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
            Incentive Tier
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {TIERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setIncentiveTier(t.value)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 10,
                  border: incentiveTier === t.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  background: incentiveTier === t.value ? '#eff6ff' : '#f9fafb',
                  color: incentiveTier === t.value ? '#1d4ed8' : '#374151',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                  lineHeight: 1.3,
                  transition: 'all 0.12s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
          Tap the badge in the card to expand
        </p>
      </div>
    </div>
  );
}
