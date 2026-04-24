import { useState } from 'react';
import {
  X,
  Star,
  Zap,
  AlertTriangle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';

// ─── Map SVG ────────────────────────────────────────────────────────────────

function MapBackground() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base map fill */}
      <rect width="400" height="280" fill="#e8edf3" />

      {/* Water bodies */}
      <ellipse cx="110" cy="130" rx="55" ry="40" fill="#b8d4e8" />
      <ellipse cx="60" cy="175" rx="25" ry="18" fill="#b8d4e8" />

      {/* Green parks */}
      <rect x="130" y="95" width="45" height="35" rx="4" fill="#c8e6c9" />
      <rect x="190" y="60" width="30" height="20" rx="3" fill="#c8e6c9" />

      {/* Grid roads */}
      {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" stroke="#fff" strokeWidth="1.5" />
      ))}
      {[40, 80, 120, 160, 200, 240].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#fff" strokeWidth="1.5" />
      ))}

      {/* Major roads */}
      <line x1="0" y1="190" x2="400" y2="190" stroke="#fff" strokeWidth="4" />
      <line x1="200" y1="0" x2="200" y2="280" stroke="#fff" strokeWidth="4" />
      <line x1="80" y1="0" x2="80" y2="280" stroke="#fff" strokeWidth="3" />
      <line x1="0" y1="100" x2="400" y2="100" stroke="#fff" strokeWidth="3" />

      {/* Highway I-3 / route 169 */}
      <line x1="320" y1="0" x2="320" y2="280" stroke="#f5c842" strokeWidth="5" />
      <line x1="0" y1="60" x2="400" y2="60" stroke="#f5c842" strokeWidth="4" />

      {/* Route path matching screenshot: starts bottom-left, goes right then up */}
      <polyline
        points="75,230 75,190 310,190 310,40 330,20"
        fill="none"
        stroke="#555"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Area labels */}
      <text x="240" y="155" fontSize="11" fill="#888" fontFamily="system-ui">Golden Valley</text>
      <text x="285" y="50" fontSize="10" fill="#888" fontFamily="system-ui">Crystal</text>
      <text x="20" y="145" fontSize="10" fill="#888" fontFamily="system-ui">Plymouth</text>
      <text x="145" y="225" fontSize="10" fill="#888" fontFamily="system-ui">CRESTVIEW</text>
      <text x="310" y="225" fontSize="10" fill="#888" fontFamily="system-ui">ELIOT</text>
      <text x="340" y="55" fontSize="9" fill="#888" fontFamily="system-ui">BROADWAY</text>

      {/* Road 169 label */}
      <rect x="176" y="52" width="28" height="16" rx="3" fill="#fff" stroke="#ccc" strokeWidth="1" />
      <text x="190" y="64" fontSize="10" textAnchor="middle" fill="#333" fontFamily="system-ui" fontWeight="600">169</text>

      {/* Pickup pin — bottom left of route */}
      <circle cx="75" cy="230" r="14" fill="#1a1a1a" />
      <rect cx="75" cy="230" x="69" y="224" width="12" height="12" rx="2" fill="#fff" />

      {/* Dropoff / driver pin — top right of route */}
      <circle cx="330" cy="20" r="20" fill="#1a56db" />
      <circle cx="330" cy="20" r="12" fill="#fff" />
      {/* Navigation arrow */}
      <polygon points="330,12 323,27 330,23 337,27" fill="#1a56db" />

      {/* Small blue dot (current location) */}
      <circle cx="330" cy="48" r="6" fill="#1a56db" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

// ─── Insight Badge ────────────────────────────────────────────────────────────

const SEVERITY_STYLES = {
  amber: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-800',
    icon: ShieldAlert,
    iconColor: 'text-red-600',
  },
};

function InsightBadge({ insights }) {
  const [expanded, setExpanded] = useState(false);

  if (!insights || insights.length === 0) return null;

  const top = insights[0];
  const extra = insights.length - 1;
  const style = SEVERITY_STYLES[top.severity] || SEVERITY_STYLES.amber;
  const Icon = style.icon;
  const ExpandIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <div className="px-4 pt-2 pb-1">
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border} ${style.text} text-sm font-medium w-full`}
      >
        <Icon size={15} className={`shrink-0 ${style.iconColor}`} />
        <span className="flex-1 text-left text-xs font-semibold truncate">
          {top.label}
          {extra > 0 && <span className="ml-1 opacity-70">+{extra}</span>}
        </span>
        <ExpandIcon size={14} className="shrink-0 opacity-60" />
      </button>

      {expanded && (
        <div className={`mt-1.5 mx-0.5 rounded-xl border ${style.border} ${style.bg} px-3 py-2`}>
          <p className="text-xs font-semibold text-gray-600 mb-1.5">
            {insights.reduce((s, i) => s + i.count, 0)} drivers reported:
          </p>
          <ul className="space-y-1">
            {insights.map((ins, idx) => {
              const s = SEVERITY_STYLES[ins.severity] || SEVERITY_STYLES.amber;
              const I = s.icon;
              return (
                <li key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <I size={12} className={s.iconColor} />
                    <span className={`${s.text} font-medium`}>{ins.label}</span>
                  </span>
                  <span className="text-gray-500 font-semibold">{ins.count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────

export default function UberOfferCard({ insights = [] }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <MapPin size={32} />
        <p className="text-sm">Offer dismissed</p>
        <button
          onClick={() => setDismissed(false)}
          className="mt-2 text-xs text-blue-500 underline"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white">
      {/* Map */}
      <div className="relative flex-1 bg-[#e8edf3]">
        <MapBackground />
      </div>

      {/* Offer card — white sheet overlaid on bottom */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
              UberX
            </span>
            <span className="text-blue-500 text-xs font-semibold">Exclusive</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fare */}
        <div className="px-4 pt-1 pb-2">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            $16.57
          </span>
        </div>

        {/* Pills: rating + incentive */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
            4.95
          </span>
          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Zap size={11} className="text-yellow-500" fill="#eab308" />
            $6.00 Flash Incentive included
          </span>
        </div>

        {/* ── Pickup Insights ── */}
        <InsightBadge insights={insights} />

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100 my-2" />

        {/* Timeline */}
        <div className="px-4 pb-3">
          <div className="flex gap-3">
            {/* Connector column */}
            <div className="flex flex-col items-center pt-1 shrink-0">
              <div className="w-3 h-3 rounded-full border-2 border-gray-800 bg-white" />
              <div className="w-0.5 flex-1 bg-gray-300 my-1" />
              <div className="w-3 h-3 rounded-sm border-2 border-gray-800 bg-white" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-3 flex-1">
              <div>
                <p className="text-xs font-bold text-gray-900">5 min (1.5 mi)</p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                  46th Ave N & Minnesota County Highway-8, Minneapolis
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">15 mins (12.1 mi)</p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                  Berkshire Ln N, Minneapolis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accept button */}
        <div className="px-4 pb-5">
          <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base py-4 rounded-2xl transition">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
