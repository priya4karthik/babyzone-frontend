import { useContext } from 'react'
import { AuthModalContext } from '../components/layout/Layout'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'
import p1 from '../assets/p1.png'
import p2 from '../assets/p2.jpg'
import p3 from '../assets/p3.jpg'
import p4 from '../assets/forum2.webp'
import w1 from '../assets/w1.jpg'
import w2 from '../assets/w2.webp'
import w3 from '../assets/w3.jpg'
import c from '../assets/m2.jpg'


const ONLINE_CLASSES = [
  {
    id: 1, title: 'Child Development', startDate: '28/08/2025', duration: '10 Days',
    img: p3,
  },
  {
    id: 2, title: 'Discipline', startDate: '29/08/2025', duration: '10 Days',
    img: p2,
  },
  {
    id: 3, title: 'Parenting techniques', startDate: '30/08/2025', duration: '10 Days',
    img: p4,
  },
  {
    id: 4, title: 'Parenting techniques', startDate: '02/09/2025', duration: '30 Days',
    img: p1,
  },
  {
    id: 5, title: 'Baby Nutrition', startDate: '05/09/2025', duration: '15 Days',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
  },
  {
    id: 6, title: 'Early Childhood', startDate: '10/09/2025', duration: '20 Days',
    img: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80',
  },
]

const WORKSHOPS = [
  {
    id: 1, title: 'Child care',
    conductor: 'James Doe', role: 'Senior Doctor',
    date: 'Wed, 28 Aug, 2025', time: '10.00 Am - 1.00 Pm',
    img: w1,
  },
  {
    id: 2, title: 'First step with baby',
    conductor: 'James Doe', role: 'Senior Doctor',
    date: 'Wed, 28 Aug, 2025', time: '10.00 Am - 1.00 Pm',
    img: w2,
  },
  {
    id: 3, title: 'The Art of Baby Handling',
    conductor: 'James Doe', role: 'Senior Doctor',
    date: 'Wed, 28 Aug, 2025', time: '10.00 Am - 1.00 Pm',
    img: w3,
  },
]

// ── Marquee card ──────────────────────────────────────────────
function ClassCard({ cls, onJoin }) {
  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        borderRadius: 14,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        marginRight: 20,
      }}
    >
      <div style={{ height: 130, overflow: 'hidden' }}>
        <img
          src={cls.img} alt={cls.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="p-3">
        <h6 className="fw-700 mb-2" style={{ fontSize: 14 }}>{cls.title}</h6>
        <div className="d-flex justify-content-between mb-3" style={{ fontSize: 12, color: '#888' }}>
          <span>Starts {cls.startDate}</span>
          <span>{cls.duration}</span>
        </div>
        <button onClick={onJoin} className="btn btn-yellow w-100 fw-700 btn-sm">
          Join class
        </button>
      </div>
    </div>
  )
}

export default function ParentingClasses() {
  const { isAuthenticated } = useAuthStore()
  const { openLogin }       = useContext(AuthModalContext)

  const handleJoin = () => {
    if (!isAuthenticated) { openLogin(); return }
    toast.success('Joined class successfully!')
  }

  const handleRegister = () => {
    if (!isAuthenticated) { openLogin(); return }
    toast.success('Registered for workshop!')
  }

  // Duplicate cards for seamless infinite loop
  const marqueeItems = [...ONLINE_CLASSES, ...ONLINE_CLASSES]

  return (
    <div className="container py-4">

      {/* ── Online Classes — Marquee ── */}
      <h4 className="fw-700 mb-4">Online Classes</h4>

      {/* Marquee wrapper */}
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          marginBottom: 48,
        }}
      >
        {/* Fade edges */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(to right, #fff, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(to left, #fff, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Scrolling track */}
        <div
          className="marquee-track"
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marqueeScroll 28s linear infinite',
            paddingBottom: 8,
          }}
          onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
        >
          {marqueeItems.map((cls, i) => (
            <ClassCard key={`${cls.id}-${i}`} cls={cls} onJoin={handleJoin} />
          ))}
        </div>
      </div>

      {/* ── Keyframe style injection ── */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Workshops ── */}
      <h4 className="fw-700 mb-4">Workshops</h4>
      <div className="row g-4 mb-5">
        {WORKSHOPS.map(ws => (
          <div key={ws.id} className="col-12 col-md-4">
            <div className="border rounded-3 overflow-hidden h-100 d-flex flex-column">
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src={ws.img} alt={ws.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="p-4 d-flex flex-column flex-grow-1">
                <h5 className="fw-700 mb-3">{ws.title}</h5>
                <p className="fw-600 mb-1" style={{ fontSize: 13 }}>Conducted by {ws.conductor}</p>
                <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{ws.role}</p>
                <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{ws.date}</p>
                <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px' }}>Time: {ws.time}</p>
                <div className="mt-auto">
                  <button onClick={handleRegister} className="btn btn-yellow fw-700 px-4">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Free sign in CTA ── */}
      <div className="parenting-cta">
        <div>
          <h5 className="fw-700 mb-3">Free sign In to Join classes and Workshop now</h5>
          <button
            onClick={() => isAuthenticated ? toast.success('You are already signed in!') : openLogin()}
            className="btn btn-yellow fw-700 px-5 py-2"
            style={{ fontSize: 15 }}
          >
            Register
          </button>
        </div>
        <div style={{ width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={c}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

    </div>
  )
}