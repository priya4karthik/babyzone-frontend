import { useState, useEffect, useRef } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'

// ── Smart bot responses for baby product queries ──────────────────
const BOT_RESPONSES = {
  'track':        '📦 To track your order, go to **My Orders** in your account. You can also visit the Track Order page. Your order status updates in real time!',
  'return':       '🔄 We offer easy 7-day returns on all products. Just go to My Orders → Select item → Request Return. Our team will pick up within 2 days!',
  'delivery':     '🚚 Free delivery on orders above ₹499! Standard delivery takes 3-5 business days. Express delivery available in select cities.',
  'payment':      '💳 We accept UPI, credit/debit cards, net banking, wallets (Paytm, GPay), and Cash on Delivery. All transactions are 100% secure via Razorpay.',
  'cancel':       '❌ You can cancel your order within 24 hours of placing it. Go to My Orders → Select order → Cancel. Refund processed in 3-5 business days.',
  'size':         '👕 For sizing, check the Age Group filter on each product page. We have sizes from Newborn to 8+ Years. Each product also has a size guide.',
  'rental':       '🔄 Rental services start from ₹99/day! You can rent strollers, car seats, cribs and more. Choose your rental period and we\'ll deliver to your door.',
  'offer':        '🎁 Current offers: Flat ₹250 off on cart above ₹2999! Check our **Offers** page for more deals and discount codes.',
  'account':      '👤 You can create a free account to track orders, save wishlist, and get exclusive offers. Click **Login / Register** in the top navbar.',
  'contact':      '📞 You can reach us at +123-456-7890 or email supporta@babyzone.com. We\'re available Mon-Sat, 9 AM to 6 PM.',
  'default':      '🍼 Thanks for your message! Our support team will get back to you within 2 hours. Meanwhile, check our FAQ section on the Contact page for quick answers.',
}

const QUICK_QUESTIONS = [
  { label: '📦 Track my order',     key: 'track'    },
  { label: '🔄 Return policy',      key: 'return'   },
  { label: '🚚 Delivery info',      key: 'delivery' },
  { label: '💳 Payment methods',    key: 'payment'  },
  { label: '❌ Cancel order',       key: 'cancel'   },
  { label: '🔄 Rental services',    key: 'rental'   },
  { label: '🎁 Offers & discounts', key: 'offer'    },
  { label: '📞 Contact support',    key: 'contact'  },
]

function getBotReply(text) {
  const lower = text.toLowerCase()
  if (lower.includes('track') || lower.includes('where') || lower.includes('order status')) return BOT_RESPONSES.track
  if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) return BOT_RESPONSES.return
  if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('ship')) return BOT_RESPONSES.delivery
  if (lower.includes('pay') || lower.includes('upi') || lower.includes('card') || lower.includes('cash')) return BOT_RESPONSES.payment
  if (lower.includes('cancel')) return BOT_RESPONSES.cancel
  if (lower.includes('size') || lower.includes('age') || lower.includes('fit')) return BOT_RESPONSES.size
  if (lower.includes('rent') || lower.includes('rental')) return BOT_RESPONSES.rental
  if (lower.includes('offer') || lower.includes('discount') || lower.includes('coupon') || lower.includes('deal')) return BOT_RESPONSES.offer
  if (lower.includes('account') || lower.includes('login') || lower.includes('register')) return BOT_RESPONSES.account
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('help')) return BOT_RESPONSES.contact
  return BOT_RESPONSES.default
}

// Global open function — called from Contact page
let globalOpenChat = null
export function openLiveChat() {
  if (globalOpenChat) globalOpenChat()
}

export default function LiveChat() {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: 'Hi there! 👋 Welcome to BabyZone support. How can I help you today?',
    },
  ])
  const bodyRef = useRef(null)

  // Register global open function
  useEffect(() => {
    globalOpenChat = () => setOpen(true)
    return () => { globalOpenChat = null }
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, typing])

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const addBotReply = (text) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text, time: now() }])
    }, 900)
  }

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { from: 'user', text, time: now() }])
    setInput('')
    addBotReply(getBotReply(text))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuick = (key) => {
    const q = QUICK_QUESTIONS.find(q => q.key === key)
    if (q) sendMessage(q.label)
  }

  return (
    <div className="live-chat-widget">
      {open && (
        <div className="live-chat-popup">
          {/* Header */}
          <div className="chat-pop-header">
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍼</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>BabyZone Support</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>● Online now</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="btn btn-link p-0 text-dark">
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-pop-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`d-flex mb-2 ${m.from === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                {m.from === 'bot' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginRight: 6, alignSelf: 'flex-end' }}>🍼</div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    background: m.from === 'user' ? 'var(--bz-yellow)' : '#f4f4f4',
                    padding: '8px 12px',
                    borderRadius: m.from === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: 10, color: '#aaa', marginTop: 2, textAlign: m.from === 'user' ? 'right' : 'left' }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="d-flex align-items-center gap-1 mb-2">
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🍼</div>
                <div style={{ background: '#f4f4f4', padding: '8px 14px', borderRadius: '12px 12px 12px 4px' }}>
                  <span style={{ display: 'inline-flex', gap: 3 }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#aaa',
                        animation: `bounce 1s infinite ${i * 0.2}s`,
                        display: 'inline-block',
                      }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK_QUESTIONS.slice(0, 4).map(q => (
              <button key={q.key} onClick={() => handleQuick(q.key)}
                style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 12,
                  border: '1px solid var(--bz-pink)', background: 'white',
                  cursor: 'pointer', whiteSpace: 'nowrap', color: '#1a1a2e',
                  fontWeight: 600, fontFamily: 'Quicksand',
                }}>
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="chat-pop-input" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" className="send-btn">
              <FiSend size={14} color="#1a1a2e" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button className="live-chat-btn" onClick={() => setOpen(!open)}>
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}