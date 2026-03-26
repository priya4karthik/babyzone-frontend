import { useState } from 'react'
import { FiFileText, FiShoppingBag, FiTruck, FiCreditCard, FiAlertTriangle, FiInfo } from 'react-icons/fi'

const sections = [
  {
    icon: <FiInfo size={24} />,
    title: 'General Terms',
    color: 'var(--bz-pink)',
    points: [
      'By accessing or using BabyZone, you agree to be bound by these Terms & Conditions.',
      'You must be at least 18 years of age to create an account and make purchases.',
      'We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance.',
      'BabyZone is an online retail platform for baby and children\'s products operating in India.',
      'All content on this website is the intellectual property of BabyZone and may not be reproduced.',
    ],
  },
  {
    icon: <FiShoppingBag size={24} />,
    title: 'Orders & Purchases',
    color: 'var(--bz-yellow)',
    points: [
      'All orders are subject to product availability. We reserve the right to cancel orders due to stock issues.',
      'Prices displayed are inclusive of applicable taxes unless stated otherwise.',
      'We reserve the right to refuse or cancel any order suspected of fraud or policy violations.',
      'Once an order is confirmed, it can be cancelled only before it is dispatched.',
      'Product images are for representation purposes only. Actual product may slightly vary.',
    ],
  },
  {
    icon: <FiCreditCard size={24} />,
    title: 'Payments',
    color: 'var(--bz-pink)',
    points: [
      'We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery (COD).',
      'COD is available for orders up to ₹5,000 and select pin codes only.',
      'All online payments are secured and processed by certified payment gateways.',
      'In case of payment failure, the amount will be refunded to the original payment method within 5-7 days.',
      'BabyZone does not store your card or bank account details.',
    ],
  },
  {
    icon: <FiTruck size={24} />,
    title: 'Shipping & Delivery',
    color: 'var(--bz-yellow)',
    points: [
      'Standard delivery takes 3-7 business days depending on your location.',
      'Free shipping is available on orders above ₹499. Orders below this attract a flat fee of ₹49.',
      'We ship across India. Certain remote pin codes may have extended delivery timelines.',
      'BabyZone is not responsible for delays caused by courier partners or force majeure events.',
      'Delivery address cannot be changed once the order is dispatched.',
    ],
  },
  {
    icon: <FiAlertTriangle size={24} />,
    title: 'Prohibited Activities',
    color: 'var(--bz-pink)',
    points: [
      'You may not use our platform for any unlawful purpose or in violation of any regulations.',
      'Creating multiple accounts to exploit offers, discounts, or referral programs is strictly prohibited.',
      'Any attempt to hack, disrupt, or gain unauthorized access to our systems will result in immediate account suspension.',
      'Posting false reviews or misleading content about products or sellers is not permitted.',
      'Reselling BabyZone products commercially without prior written consent is prohibited.',
    ],
  },
  {
    icon: <FiFileText size={24} />,
    title: 'Limitation of Liability',
    color: 'var(--bz-yellow)',
    points: [
      'BabyZone is not liable for any indirect, incidental, or consequential damages arising from use of our platform.',
      'Our maximum liability in any dispute shall not exceed the value of the order in question.',
      'We do not guarantee uninterrupted, error-free access to the website at all times.',
      'Product safety is the manufacturer\'s responsibility. Please follow all product guidelines and age recommendations.',
      'BabyZone acts as a facilitator and is not liable for third-party seller disputes where applicable.',
    ],
  },
]

export default function TermsConditions() {
  const [active, setActive] = useState(0)

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav className="bz-breadcrumb mb-3">
        <a href="/">Home</a>
        <span className="separator">/</span>
        <span className="current">Terms & Conditions</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: '36px 24px', border: '1px solid var(--bz-pink)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
        <h2 className="fw-700 mb-2">Terms & Conditions</h2>
        <p style={{ fontSize: 14, color: '#555', maxWidth: 520, margin: '0 auto' }}>
          Please read these terms carefully before using BabyZone. By shopping with us, you agree to the following.
        </p>
        <p style={{ fontSize: 12, color: '#888', marginTop: 12, marginBottom: 0 }}>Last updated: January 2025</p>
      </div>

      <div className="row g-4 mb-5">
        {/* Tab navigation */}
        <div className="col-12 col-md-3">
          <div style={{ border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', position: 'sticky', top: 80 }}>
            {sections.map((s, i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  borderBottom: i < sections.length - 1 ? '1px solid #eee' : 'none',
                  background: active === i ? 'var(--bz-pink)' : '#fff',
                  color: active === i ? '#1a1a2e' : '#555',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ opacity: active === i ? 1 : 0.5 }}>{s.icon}</span>
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-12 col-md-9">
          <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 28 }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: sections[active].color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sections[active].icon}
              </div>
              <h4 className="fw-700 mb-0">{sections[active].title}</h4>
            </div>
            <div className="d-flex flex-column gap-3">
              {sections[active].points.map((p, i) => (
                <div key={i} className="d-flex gap-3 align-items-start" style={{ background: 'var(--bz-gray)', borderRadius: 10, padding: '14px 16px' }}>
                  <span style={{ background: sections[active].color, borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-secondary btn-sm fw-700"
                disabled={active === 0}
                onClick={() => setActive(a => a - 1)}
              >← Previous</button>
              <button
                className="btn btn-yellow btn-sm"
                disabled={active === sections.length - 1}
                onClick={() => setActive(a => a + 1)}
              >Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Acceptance CTA */}
      <div className="text-center" style={{ background: 'var(--bz-yellow)', borderRadius: 16, padding: '28px 24px' }}>
        <h5 className="fw-700 mb-1">Questions about our Terms?</h5>
        <p style={{ fontSize: 13, marginBottom: 16 }}>Our legal team is happy to clarify. Reach us at <strong>legal@babyzone.in</strong></p>
        <a href="/contact" className="btn btn-dark btn-sm fw-700 px-4">Get in Touch</a>
      </div>

    </div>
  )
}