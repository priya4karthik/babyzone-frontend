import { Link } from 'react-router-dom'

const OFFERS = [
  {
    icon: '🎁',
    title: 'Flat ₹250 Off',
    desc: 'Get Rs.250 additional off on cart value of Rs.2999 and above',
    code: 'SAVE250',
    color: '#fff8e1',
    border: '#FFD83B',
  },
  {
    icon: '🚚',
    title: 'Free Delivery',
    desc: 'Free delivery on all orders above Rs.499 | Fast shipping across India',
    code: 'FREESHIP',
    color: '#e8f5e9',
    border: '#66bb6a',
  },
  {
    icon: '👶',
    title: 'New Arrivals Sale',
    desc: 'New arrivals! Dress your little one in soft breathable fabrics. Starting from ₹299',
    code: 'NEWBORN',
    color: '#fce4ec',
    border: '#FFB2E6',
  },
  {
    icon: '🔄',
    title: 'Easy 7-Day Returns',
    desc: 'Easy 7-day returns on all products | 100% authentic guaranteed',
    code: 'RETURN7',
    color: '#e3f2fd',
    border: '#42a5f5',
  },
  {
    icon: '💝',
    title: 'Buy 2 Get 1 Free',
    desc: 'Buy any 2 baby fashion items and get 1 free. Selected products only.',
    code: 'B2G1FREE',
    color: '#f3e5f5',
    border: '#ab47bc',
  },
  {
    icon: '🌟',
    title: 'Premium Products',
    desc: 'Flat 15% off on all premium baby care products. Use code at checkout.',
    code: 'PREMIUM15',
    color: '#fff3e0',
    border: '#ffa726',
  },
]

export default function Offers() {
  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => alert(`Code "${code}" copied!`))
      .catch(() => {})
  }

  return (
    <div className="container py-5">
      <h2 className="fw-700 mb-2">🏷️ Offers & Deals</h2>
      <p className="text-muted mb-5" style={{ fontSize: 14 }}>
        Exclusive deals just for you. Copy the code and apply at checkout!
      </p>

      <div className="row g-4">
        {OFFERS.map((offer, i) => (
          <div key={i} className="col-12 col-md-6">
            <div style={{
              background: offer.color,
              border: `2px dashed ${offer.border}`,
              borderRadius: 16,
              padding: 24,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {/* Icon + Title */}
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  fontSize: 36, lineHeight: 1,
                  width: 56, height: 56,
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {offer.icon}
                </div>
                <h5 className="fw-700 mb-0" style={{ fontSize: 16 }}>{offer.title}</h5>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0, flex: 1 }}>
                {offer.desc}
              </p>

              {/* Coupon code + copy */}
              <div className="d-flex align-items-center gap-2 mt-1">
                <div style={{
                  background: 'white',
                  border: `1.5px solid ${offer.border}`,
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1,
                  flex: 1,
                  textAlign: 'center',
                  color: '#1a1a2e',
                  fontFamily: 'monospace',
                }}>
                  {offer.code}
                </div>
                <button
                  onClick={() => copyCode(offer.code)}
                  className="btn btn-yellow fw-700"
                  style={{ fontSize: 13, whiteSpace: 'nowrap', borderRadius: 8 }}
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-5 py-4" style={{
        background: 'var(--bz-pink)',
        borderRadius: 16,
      }}>
        <h4 className="fw-700 mb-2">Ready to shop? 🍼</h4>
        <p className="text-muted mb-3" style={{ fontSize: 14 }}>
          Use any of the above codes at checkout to save big!
        </p>
        <Link to="/products" className="btn btn-yellow px-5 py-2 fw-700" style={{ fontSize: 15 }}>
          Shop Now
        </Link>
      </div>
    </div>
  )
}