import { useState } from 'react'
import { FiPackage, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiClock, FiPhone } from 'react-icons/fi'

const steps = [
  { icon: '📦', title: 'Initiate Return', desc: 'Go to My Orders and select the item you want to return within 7 days of delivery.' },
  { icon: '🏷️', title: 'Pack the Item', desc: 'Pack the product securely in its original packaging with all tags and accessories.' },
  { icon: '🚚', title: 'Pickup Scheduled', desc: 'Our delivery partner will pick up the item from your doorstep within 2-3 business days.' },
  { icon: '✅', title: 'Refund Processed', desc: 'Once we inspect the item, your refund will be credited within 5-7 business days.' },
]

const cards = [
  {
    icon: <FiCheckCircle size={28} />,
    title: 'Eligible Items',
    color: '#FFB2E6',
    points: [
      'Unused items in original packaging',
      'Items with tags intact',
      'Wrong or defective product received',
      'Size or color mismatch',
      'Returned within 7 days of delivery',
    ],
  },
  {
    icon: <FiAlertCircle size={28} />,
    title: 'Non-Returnable Items',
    color: '#FFD83B',
    points: [
      'Used, washed, or worn products',
      'Items without original tags',
      'Innerwear & hygiene products',
      'Gift cards & digital products',
      'Items damaged due to misuse',
    ],
  },
  {
    icon: <FiRefreshCw size={28} />,
    title: 'Exchange Policy',
    color: '#FFB2E6',
    points: [
      'Exchange for different size or color',
      'Subject to stock availability',
      'One exchange per order allowed',
      'Must be requested within 7 days',
      'Free exchange on eligible items',
    ],
  },
  {
    icon: <FiClock size={28} />,
    title: 'Refund Timeline',
    color: '#FFD83B',
    points: [
      'UPI / Wallet: 1-2 business days',
      'Debit / Credit card: 5-7 business days',
      'Net Banking: 3-5 business days',
      'Store credit: Instant',
      'COD refund via bank transfer: 5-7 days',
    ],
  },
]

const faqs = [
  { q: 'How do I initiate a return?', a: 'Go to My Orders → Select item → Click "Return/Exchange" → Choose reason → Submit. Our team will reach out within 24 hours.' },
  { q: 'Can I return a sale or discounted item?', a: 'Items bought during a sale are eligible for return only if they are defective or wrongly delivered. Regular return policy applies for exchanges.' },
  { q: 'What if I received a damaged product?', a: 'Please raise a return request within 48 hours of delivery with photos of the damaged item. We will arrange an immediate pickup and replacement.' },
  { q: 'Will I get a full refund including shipping charges?', a: 'Shipping charges are refunded only if the return is due to a defective or wrong product. For other returns, original shipping charges are non-refundable.' },
]

export default function ReturnExchange() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav className="bz-breadcrumb mb-3">
        <a href="/">Home</a>
        <span className="separator">/</span>
        <span className="current">Returns & Exchange</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: '36px 24px', border: '1px solid var(--bz-pink)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔄</div>
        <h2 className="fw-700 mb-2">Returns & Exchange</h2>
        <p style={{ fontSize: 14, color: '#555', maxWidth: 500, margin: '0 auto' }}>
          We want you to love every purchase. If something isn't right, we're here to make it easy.
        </p>
        <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
          <span style={{ background: 'var(--bz-yellow)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>7-Day Returns</span>
          <span style={{ background: 'var(--bz-pink)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>Free Pickup</span>
          <span style={{ background: 'var(--bz-yellow)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700 }}>Easy Refunds</span>
        </div>
      </div>

      {/* How it works */}
      <h4 className="fw-700 mb-4 text-center">How It Works</h4>
      <div className="row g-3 mb-5">
        {steps.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="text-center h-100" style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '24px 16px' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ background: 'var(--bz-yellow)', borderRadius: 20, fontSize: 11, fontWeight: 700, padding: '2px 10px', display: 'inline-block', marginBottom: 8 }}>Step {i + 1}</div>
              <h6 className="fw-700 mb-2" style={{ fontSize: 14 }}>{s.title}</h6>
              <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Policy cards */}
      <h4 className="fw-700 mb-4 text-center">Policy Details</h4>
      <div className="row g-3 mb-5">
        {cards.map((c, i) => (
          <div key={i} className="col-12 col-md-6">
            <div className="h-100" style={{ border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', flexShrink: 0 }}>
                  {c.icon}
                </div>
                <h5 className="fw-700 mb-0" style={{ fontSize: 16 }}>{c.title}</h5>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {c.points.map((p, j) => (
                  <li key={j} style={{ fontSize: 13, color: '#555', marginBottom: 6, lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
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

      {/* Contact CTA */}
      <div className="text-center" style={{ background: 'var(--bz-yellow)', borderRadius: 16, padding: '28px 24px' }}>
        <FiPhone size={28} className="mb-2" />
        <h5 className="fw-700 mb-1">Still have questions?</h5>
        <p style={{ fontSize: 13, marginBottom: 16 }}>Our support team is available Mon–Sat, 9am–6pm</p>
        <a href="/contact" className="btn btn-dark btn-sm fw-700 px-4">Contact Support</a>
      </div>

    </div>
  )
}