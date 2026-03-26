import { FiShield, FiEye, FiLock, FiShare2, FiSettings, FiMail } from 'react-icons/fi'

const sections = [
  {
    icon: <FiEye size={24} />,
    title: 'Information We Collect',
    content: [
      { subtitle: 'Personal Information', text: 'When you create an account or place an order, we collect your name, email address, phone number, and delivery address.' },
      { subtitle: 'Payment Information', text: 'We do not store your card details. All payments are processed securely through our payment partners (Razorpay/Stripe) using industry-standard encryption.' },
      { subtitle: 'Usage Data', text: 'We collect data on how you interact with our website including pages visited, products viewed, and search queries to improve your experience.' },
    ],
  },
  {
    icon: <FiShare2 size={24} />,
    title: 'How We Use Your Information',
    content: [
      { subtitle: 'Order Processing', text: 'Your personal and address details are used solely to process, ship, and deliver your orders and keep you updated on their status.' },
      { subtitle: 'Communications', text: 'We may send you order confirmations, shipping updates, and promotional offers. You can unsubscribe from marketing emails at any time.' },
      { subtitle: 'Personalization', text: 'We use browsing and purchase history to recommend products relevant to your baby\'s age, gender, and preferences.' },
    ],
  },
  {
    icon: <FiShare2 size={24} />,
    title: 'Sharing Your Information',
    content: [
      { subtitle: 'Delivery Partners', text: 'We share your name, phone, and address with logistics partners solely for the purpose of delivering your orders.' },
      { subtitle: 'Payment Processors', text: 'Payment information is handled by certified payment gateways. We only receive confirmation of successful transactions.' },
      { subtitle: 'No Third-Party Selling', text: 'We never sell, rent, or trade your personal information to any third party for marketing or advertising purposes.' },
    ],
  },
  {
    icon: <FiLock size={24} />,
    title: 'Data Security',
    content: [
      { subtitle: 'Encryption', text: 'All data transmitted between your browser and our servers is encrypted using SSL/TLS technology.' },
      { subtitle: 'Access Controls', text: 'Access to your personal data is restricted to authorized employees who need it to provide our services.' },
      { subtitle: 'Breach Notification', text: 'In the unlikely event of a data breach, we will notify affected users within 72 hours as required by applicable law.' },
    ],
  },
  {
    icon: <FiSettings size={24} />,
    title: 'Your Rights & Choices',
    content: [
      { subtitle: 'Access & Correction', text: 'You can access and update your personal information anytime through your account settings.' },
      { subtitle: 'Data Deletion', text: 'You may request deletion of your account and all associated data by contacting our support team. We will process this within 30 days.' },
      { subtitle: 'Marketing Opt-Out', text: 'You can opt out of marketing emails by clicking "Unsubscribe" in any email or by updating your notification preferences in your account.' },
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav className="bz-breadcrumb mb-3">
        <a href="/">Home</a>
        <span className="separator">/</span>
        <span className="current">Privacy Policy</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: '36px 24px', border: '1px solid var(--bz-pink)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 className="fw-700 mb-2">Privacy Policy</h2>
        <p style={{ fontSize: 14, color: '#555', maxWidth: 520, margin: '0 auto' }}>
          At BabyZone, your privacy matters to us as much as your baby's comfort. Here's how we handle your data.
        </p>
        <p style={{ fontSize: 12, color: '#888', marginTop: 12, marginBottom: 0 }}>Last updated: January 2025</p>
      </div>

      {/* Quick highlights */}
      <div className="row g-3 mb-5">
        {[
          { icon: '🚫', text: 'We never sell your data' },
          { icon: '🔐', text: 'SSL encrypted transactions' },
          { icon: '📧', text: 'Unsubscribe anytime' },
          { icon: '🗑️', text: 'Request data deletion anytime' },
        ].map((h, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="text-center" style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '20px 12px' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{h.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#1a1a2e' }}>{h.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Policy sections */}
      <div className="d-flex flex-column gap-3 mb-5">
        {sections.map((s, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: i % 2 === 0 ? 'var(--bz-pink)' : 'var(--bz-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <h5 className="fw-700 mb-0">{s.title}</h5>
            </div>
            <div className="row g-3">
              {s.content.map((c, j) => (
                <div key={j} className="col-12 col-md-4">
                  <div style={{ background: 'var(--bz-gray)', borderRadius: 10, padding: '14px 16px', height: '100%' }}>
                    <p className="fw-700 mb-1" style={{ fontSize: 13 }}>{c.subtitle}</p>
                    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cookies */}
      <div className="mb-5" style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: 24, border: '1px solid var(--bz-pink)' }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <span style={{ fontSize: 28 }}>🍪</span>
          <h5 className="fw-700 mb-0">Cookies Policy</h5>
        </div>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: 0 }}>
          We use cookies to remember your preferences, keep you logged in, and understand how you use our site.
          Essential cookies are required for the site to function. Analytics and marketing cookies are optional
          and can be controlled via your browser settings. By continuing to use BabyZone, you consent to our
          use of essential cookies.
        </p>
      </div>

      {/* Contact CTA */}
      <div className="text-center" style={{ background: 'var(--bz-yellow)', borderRadius: 16, padding: '28px 24px' }}>
        <FiMail size={28} className="mb-2" />
        <h5 className="fw-700 mb-1">Privacy Concerns?</h5>
        <p style={{ fontSize: 13, marginBottom: 16 }}>Reach out to our Data Protection team at <strong>privacy@babyzone.in</strong></p>
        <a href="/contact" className="btn btn-dark btn-sm fw-700 px-4">Contact Us</a>
      </div>

    </div>
  )
}