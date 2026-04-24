import DriverFeedbackForm from './components/DriverFeedbackForm'
import PhoneFrame from './components/PhoneFrame'

export default function App() {
  return (
    <div style={s.desktop}>
      <PhoneFrame>
        <DriverFeedbackForm />
      </PhoneFrame>
      <p style={s.label}>Uber · Pickup Insights — Driver Feedback</p>
    </div>
  )
}

const s = {
  desktop: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: 28,
  },
  label: {
    color: 'rgba(0,0,0,0.25)',
    fontSize: 12,
    fontFamily: '-apple-system, sans-serif',
    letterSpacing: 0.5,
  },
}
