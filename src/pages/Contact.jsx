import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPhone, FiMail, FiPackage, FiRefreshCw, FiChevronDown, FiChevronUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import api from '../utils/api'
import { openLiveChat } from '../components/ui/LiveChat'

const FAQS = [
  { q: 'Where are the offices of BabyZone located?', a: 'Currently our office is located in Madurai while the orders are shipped from our warehouses located across India.' },
  { q: 'How do I know my order has been confirmed?', a: 'After checking out during the payment process, you will get a confirmation that your payment has been processed successfully. You will also get a mail in your registered email id, along with an SMS to your registered mobile number confirming the order.' },
  { q: 'Are there any other hidden charges like Octroi or Entry tax?', a: 'You will get the final price during check out. Our prices are all inclusive and you need not pay anything extra.' },
  { q: 'How long will it take to receive my orders?', a: 'For all areas serviced by reputed couriers, the delivery time would be within 3 to 4 business days after dispatch. Items weighing over 2 kilos may take longer. For other areas products will be shipped through Indian Postal Service and may take 1-2 weeks.' },
  { q: 'Will my GST amount be refunded on Order Cancellation and Returns?', a: "Yes. GST amount collected will be returned to customer's source method at the time of Cancellation and Returns." },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-100 text-start fw-600 border-0 bg-transparent d-flex justify-content-between align-items-center py-2"
        style={{ fontSize: 14, color: '#1a1a2e' }}>
        {q}
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {open && (
        <div className="border rounded-3 p-3 mt-1"
          style={{ fontSize: 13, color: '#555', lineHeight: 1.7, background: '#fff' }}>
          {a}
        </div>
      )}
    </div>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <div className="d-flex align-items-center gap-1 mt-1" style={{ fontSize: 12, color: '#dc3545' }}>
      <FiAlertCircle size={12} /> {msg}
    </div>
  )
}

export default function Contact() {
  const navigate  = useNavigate()
  const [form, setForm]         = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                e.name    = 'Name is required'
    else if (form.name.trim().length < 2) e.name    = 'Name must be at least 2 characters'
    if (!form.email.trim())               e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.message.trim())             e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await api.post('/contact/', {
        name: form.name.trim(), email: form.email.trim(),
        phone: form.phone.trim(), message: form.message.trim(),
      })
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      setErrors({})
    } catch (err) {
      const data = err?.response?.data
      if (data?.errors) {
        const be = {}
        Object.entries(data.errors).forEach(([k, v]) => { be[k] = Array.isArray(v) ? v[0] : v })
        setErrors(be)
      } else {
        setErrors({ message: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row g-5 mb-5">

        {/* ── Left: Reach us ── */}
        <div className="col-12 col-md-5">
          <h4 className="fw-700 mb-4">Reach us</h4>

          {/* Phone & Email — open native apps */}
          <div className="border rounded-3 p-3 mb-3 d-flex flex-column gap-3" style={{ background: '#fff' }}>
            <a href="tel:+1234567890"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{ color: '#1a1a2e' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiPhone size={16} color="var(--bz-red)" />
              </div>
              <div>
                <p className="fw-700 mb-0" style={{ fontSize: 14 }}>+91 78965412380</p>
                <p className="mb-0" style={{ fontSize: 12, color: '#888' }}>Tap to call</p>
              </div>
            </a>
            <a href="mailto:supporta@babyzone.com"
              className="d-flex align-items-center gap-3 text-decoration-none"
              style={{ color: '#1a1a2e' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiMail size={16} color="var(--bz-red)" />
              </div>
              <div>
                <p className="fw-700 mb-0" style={{ fontSize: 14 }}>supporta@babyzone.com</p>
                <p className="mb-0" style={{ fontSize: 12, color: '#888' }}>Tap to email</p>
              </div>
            </a>
          </div>

          {/* Track order → /orders */}
          <div className="border rounded-3 p-3 mb-3 d-flex align-items-center gap-3"
            onClick={() => navigate('/orders')}
            style={{ cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiPackage size={20} color="#555" />
            </div>
            <div>
              <p className="fw-700 mb-0" style={{ fontSize: 14 }}>Track order &amp; Cancel order</p>
              <p className="mb-0" style={{ fontSize: 12, color: '#888' }}>View your orders</p>
            </div>
          </div>

          {/* Exchange & refund → /orders */}
          <div className="border rounded-3 p-3 mb-4 d-flex align-items-center gap-3"
            onClick={() => navigate('/returns')}
            style={{ cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bz-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiRefreshCw size={20} color="#555" />
            </div>
            <div>
              <p className="fw-700 mb-0" style={{ fontSize: 14 }}>Exchange and refund policy</p>
              <p className="mb-0" style={{ fontSize: 12, color: '#888' }}>Easy 7-day returns</p>
            </div>
          </div>

          <button onClick={openLiveChat} className="btn btn-yellow px-5 py-2 fw-700" style={{ fontSize: 15 }}>
            Live Chat
          </button>
        </div>

        {/* ── Right: Contact form ── */}
        <div className="col-12 col-md-7">
          <div style={{ background: 'var(--bz-pink)', borderRadius: 16, padding: 28 }}>
            <h4 className="fw-700 mb-4">Contact Form</h4>

            {submitted ? (
              <div className="text-center py-4">
                <div style={{ fontSize: 64 }}>✅</div>
                <h5 className="fw-700 mt-3 mb-2">Message Sent!</h5>
                <p style={{ fontSize: 14, color: '#555' }}>Thank you! We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-yellow px-5 mt-2 fw-700">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                <div className="mb-3">
                  <label className="fw-600 mb-1" style={{ fontSize: 14 }}>
                    Name <span style={{ color: 'var(--bz-red)' }}>*</span>
                  </label>
                  <input
                    className={`form-control ${errors.name ? 'is-invalid' : form.name.length >= 2 ? 'is-valid' : ''}`}
                    placeholder="Your Name"
                    value={form.name} onChange={e => set('name', e.target.value)}
                  />
                  <FieldError msg={errors.name} />
                </div>

                <div className="mb-3">
                  <label className="fw-600 mb-1" style={{ fontSize: 14 }}>
                    Email <span style={{ color: 'var(--bz-red)' }}>*</span>
                  </label>
                  <input
                    className={`form-control ${errors.email ? 'is-invalid' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'is-valid' : ''}`}
                    type="email" placeholder="Email Id"
                    value={form.email} onChange={e => set('email', e.target.value)}
                  />
                  <FieldError msg={errors.email} />
                </div>

                <div className="mb-3">
                  <label className="fw-600 mb-1" style={{ fontSize: 14 }}>Phone Number</label>
                  <input
                    className={`form-control ${errors.phone ? 'is-invalid' : form.phone.length === 10 ? 'is-valid' : ''}`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                  />
                  <FieldError msg={errors.phone} />
                </div>

                <div className="mb-4">
                  <label className="fw-600 mb-1" style={{ fontSize: 14 }}>
                    Queries <span style={{ color: 'var(--bz-red)' }}>*</span>
                    <span style={{ fontSize: 11, color: '#888', fontWeight: 400, marginLeft: 8 }}>
                      ({form.message.length}/500)
                    </span>
                  </label>
                  <textarea
                    className={`form-control ${errors.message ? 'is-invalid' : form.message.length >= 10 ? 'is-valid' : ''}`}
                    placeholder="Your Message... (min 10 characters)"
                    rows={4} maxLength={500}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    style={{ resize: 'none' }}
                  />
                  <FieldError msg={errors.message} />
                </div>

                <button type="submit" className="btn btn-yellow w-100 fw-700 py-2" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                    : <><FiCheckCircle size={15} className="me-2" />Send Message</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: 'var(--bz-pink)', borderRadius: 16, padding: 32 }}>
        <h4 className="fw-700 text-center mb-4">FAQ's</h4>
        {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
      </div>
    </div>
  )
}