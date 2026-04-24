export default function PhoneFrame({ children }) {
  return (
    <div style={s.shell}>
      {/* Left buttons */}
      <div style={{ ...s.btn, ...s.volUp1 }} />
      <div style={{ ...s.btn, ...s.volUp2 }} />
      <div style={{ ...s.btn, ...s.mute }} />
      {/* Right button */}
      <div style={{ ...s.btn, ...s.power }} />

      {/* Screen */}
      <div style={s.screen}>

        {/* Status bar */}
        <div style={s.statusBar}>
          <span style={s.time}>9:41</span>

          <div style={s.dynamicIsland} />

          <div style={s.statusIcons}>
            {/* Signal */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0"    y="8"  width="3" height="4"  rx="1" fill="white" fillOpacity="0.4"/>
              <rect x="4.5"  y="5"  width="3" height="7"  rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="9"    y="2"  width="3" height="10" rx="1" fill="white" fillOpacity="0.8"/>
              <rect x="13.5" y="0"  width="3" height="12" rx="1" fill="white"/>
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 20 15" fill="white">
              <circle cx="10" cy="13.5" r="1.5"/>
              <path d="M6.5 10.5a5 5 0 017 0l1.5-1.5a7 7 0 00-10 0l1.5 1.5z" opacity="0.7"/>
              <path d="M3.5 7.5a9 9 0 0113 0l1.5-1.5a11 11 0 00-16 0l1.5 1.5z" opacity="0.4"/>
            </svg>
            {/* Battery */}
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
              <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
              <rect x="2"   y="2"   width="18" height="8"  rx="2"   fill="white"/>
              <path d="M24 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* Scrollable form content */}
        <div style={s.content}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={s.homeBarArea}>
          <div style={s.homeBar} />
        </div>

      </div>
    </div>
  )
}

const s = {
  shell: {
    position: 'relative',
    width: 393,
    height: 832,
    borderRadius: 54,
    background: 'linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)',
    boxShadow: `
      0 0 0 1px #3a3a3a,
      0 0 0 2px #111,
      0 40px 100px rgba(0,0,0,0.7),
      0 20px 40px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.07)
    `,
    flexShrink: 0,
  },

  /* Physical buttons */
  btn: {
    position: 'absolute',
    background: '#2e2e2e',
    borderRadius: 3,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  mute: {
    left: -4,
    top: 110,
    width: 4,
    height: 32,
    borderRadius: '2px 0 0 2px',
  },
  volUp1: {
    left: -4,
    top: 162,
    width: 4,
    height: 64,
    borderRadius: '2px 0 0 2px',
  },
  volUp2: {
    left: -4,
    top: 238,
    width: 4,
    height: 64,
    borderRadius: '2px 0 0 2px',
  },
  power: {
    right: -4,
    top: 180,
    width: 4,
    height: 80,
    borderRadius: '0 2px 2px 0',
  },

  /* Screen */
  screen: {
    position: 'absolute',
    inset: 10,
    borderRadius: 46,
    background: '#000',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  /* Status bar */
  statusBar: {
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 28px 0',
    flexShrink: 0,
    position: 'relative',
  },
  time: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: '-apple-system, sans-serif',
    letterSpacing: -0.3,
    minWidth: 40,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 120,
    height: 34,
    background: '#000',
    borderRadius: 20,
    boxShadow: '0 0 0 1.5px #1a1a1a',
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    minWidth: 60,
    justifyContent: 'flex-end',
  },

  /* Content */
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },

  /* Home bar */
  homeBarArea: {
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: '#000',
  },
  homeBar: {
    width: 134,
    height: 5,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.3)',
  },
}
