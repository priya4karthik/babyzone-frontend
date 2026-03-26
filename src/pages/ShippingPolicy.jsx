import { useState } from 'react'
import { FiTruck, FiMapPin, FiClock, FiPackage, FiAlertCircle, FiPhone } from 'react-icons/fi'

const shippingOptions = [
  {
    icon: '🚚',
    title: 'Standard Delivery',
    time: '3–7 Business Days',
    cost: 'Free above ₹499',
    costSub: '₹49 below ₹499',
    color: 'var(--bz-pink)',
    desc: 'Available across all serviceable pin codes in India.',
  },
  {
    icon: '⚡',
    title: 'Express Delivery',
    time: '1–2 Business Days',
    cost: '₹99 flat',
    costSub: 'Select cities only',
    color: 'var(--bz-yellow)',
    desc: 'Available in Bengaluru, Mumbai, Delhi, Chennai, Hyderabad & Pune.',
  },
  {
    icon: '🏙️',
    title: 'Same Day Delivery',
    time: 'Within 6–8 Hours',
    cost: '₹149 flat',
    costSub: 'Order before 12 PM',
    color: 'var(--bz-pink)',
    desc: 'Currently available in Bengaluru only. Subject to stock availability.',
  },
]

const steps = [
  { icon: '🛒', title: 'Order Placed', desc: 'You place an order and receive a confirmation email with your order ID.' },
  { icon: '✅', title: 'Order Confirmed', desc: 'Our warehouse team verifies the order and initiates packing within 12 hours.' },
  { icon: '📦', title: 'Packed & Dispatched', desc: 'Your order is securely packed and handed over to our courier partner.' },
  { icon: '🚚', title: 'Out for Delivery', desc: 'You receive a tracking link via SMS/email. Our delivery partner is on the way.' },
  { icon: '🎉', title: 'Delivered', desc: 'Your order arrives safely. Enjoy your BabyZone purchase!' },
]

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order is dispatched, you will receive a tracking link via SMS and email. You can also track your order from My Orders in your account.' },
  { q: 'Do you deliver to all pin codes in India?', a: 'We deliver to most pin codes across India. If your pin code is not serviceable, you will be notified at checkout before placing the order.' },
  { q: 'What happens if I miss the delivery?', a: 'Our delivery partner will attempt delivery twice. If both attempts fail, the order will be returned to our warehouse and a refund will be initiated.' },
  { q: 'Can I change my delivery address after placing an order?', a: 'Address changes are not possible once the order is dispatched. You may request a change before dispatch by contacting our support team immediately.' },
  { q: 'Is there a weight or size limit per order?', a: 'There is no general weight limit. However, bulky items like furniture or large baby gear may have separate delivery timelines and charges shown at checkout.' },
]

export default function ShippingPolicy() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav className="bz-breadcrumb mb-3">
        <a href="/">Home</a>
        <span className="separator">/</span>
        <span className="current">Shipping Policy</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: '36px 24px', border: '1px solid var(--bz-pink)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚚</div>
        <h2 className="fw-700 mb-2">Shipping Policy</h2>
        <p style={{ fontSize: 14, color: '#555', maxWidth: 520, margin: '0 auto' }}>
          Fast, safe, and reliable delivery across India — because your little one can't wait!
        </p>
        <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
          <span style={{ background: 'var(--bz-yellow)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>Free Shipping ₹499+</span>
          <span style={{ background: 'var(--bz-pink)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>Pan India Delivery</span>
          <span style={{ background: 'var(--bz-yellow)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>Live Order Tracking</span>
        </div>
      </div>

      {/* Shipping options */}
      <h4 className="fw-700 mb-4 text-center">Delivery Options</h4>
      <div className="row g-3 mb-5">
        {shippingOptions.map((o, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className="h-100 text-center" style={{ border: '1px solid #eee', borderRadius: 12, padding: '28px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{o.icon}</div>
              <div style={{ background: o.color, borderRadius: 8, padding: '4px 14px', display: 'inline-block', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{o.time}</div>
              <h5 className="fw-700 mb-2" style={{ fontSize: 16 }}>{o.title}</h5>
              <p className="fw-700 mb-0" style={{ fontSize: 15, color: '#1a1a2e' }}>{o.cost}</p>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>{o.costSub}</p>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>{o.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order journey */}
      <h4 className="fw-700 mb-4 text-center">Your Order's Journey</h4>
      <div className="mb-5 track-timeline" style={{ maxWidth: 600, margin: '0 auto 40px' }}>
        {steps.map((s, i) => (
          <div key={i} className={`track-step ${i < 3 ? 'done' : ''}`}>
            <div className="track-icon" style={{ fontSize: 20 }}>{s.icon}</div>
            <div className="track-info">
              <h6>{s.title}</h6>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Important notes */}
      <h4 className="fw-700 mb-4 text-center">Important Notes</h4>
      <div className="row g-3 mb-5">
        {[
          { icon: <FiClock size={20} />, title: 'Business Days', text: 'Delivery timelines exclude Sundays and public holidays. Orders placed after 3 PM may be processed the next business day.' },
          { icon: <FiMapPin size={20} />, title: 'Remote Areas', text: 'Delivery to remote or hilly regions may take up to 10–12 business days. Additional charges may apply.' },
          { icon: <FiPackage size={20} />, title: 'Secure Packaging', text: 'All products are packed in child-safe, eco-friendly packaging to ensure they reach you in perfect condition.' },
          { icon: <FiAlertCircle size={20} />, title: 'Damaged in Transit', text: 'If your order arrives damaged, please take photos and raise a complaint within 48 hours of delivery for a quick resolution.' },
        ].map((n, i) => (
          <div key={i} className="col-12 col-md-6">
            <div className="d-flex gap-3 align-items-start h-100" style={{ border: '1px solid #eee', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: i % 2 === 0 ? 'var(--bz-pink)' : 'var(--bz-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n.icon}
              </div>
              <div>
                <p className="fw-700 mb-1" style={{ fontSize: 14 }}>{n.title}</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>{n.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h4 className="fw-700 mb-4 text-center">Frequently Asked Questions</h4>
      <div className="mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: 24, border: '1px solid var(--bz-pink)' }}>
        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span>{f.q}</span>
              <span>{openFaq === i ? '▲' : '▼'}</span>
            </div>
            {openFaq === i && (
              <div className="faq-answer">{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center" style={{ background: 'var(--bz-yellow)', borderRadius: 16, padding: '28px 24px' }}>
        <FiPhone size={28} className="mb-2" />
        <h5 className="fw-700 mb-1">Need help with your delivery?</h5>
        <p style={{ fontSize: 13, marginBottom: 16 }}>We're available Mon–Sat, 9am–6pm to assist you</p>
        <a href="/contact" className="btn btn-dark btn-sm fw-700 px-4">Contact Support</a>
      </div>

    </div>
  )
}