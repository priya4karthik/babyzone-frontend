import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useCartStore, useWishlistStore, useAuthStore } from '../store'
import toast from 'react-hot-toast'

// ── Fallback products (same as RentalServices) ─────────────────
const FALLBACK_RENTALS = [
  {
    id: 1,
    name: 'LuvLap Galaxy Baby Stroller for 03 Years, 5-Point Safety Harness',
    price_display: '₹199 for One day', mrp: 199,
    colors: ['#EE0606', '#000', '#1a56db'], primary_image: null,
    description: 'The LuvLap Galaxy Baby Stroller is designed for babies from birth to 3 years. Features 5-point safety harness, reclining seat, large canopy, and easy fold mechanism. Perfect for daily use and travel.',
    specifications: [
      { label: 'Age Group', value: '0 - 3 Years' },
      { label: 'Weight Capacity', value: 'Up to 15 kg' },
      { label: 'Folded Dimensions', value: '75 x 46 x 28 cm' },
      { label: 'Seat Recline', value: '3-position recline' },
      { label: 'Canopy', value: 'Large UV-protective canopy' },
      { label: 'Wheels', value: '4 swivel wheels with brake' },
      { label: 'Material', value: 'Aluminium frame, Polyester fabric' },
      { label: 'Safety', value: '5-point safety harness' },
    ],
    images: [],
    rental_period: 'Daily / Weekly / Monthly',
    deposit: 500,
  },
  {
    id: 2,
    name: 'Lightweight & Compact Tour Infant Travel Stroller - Blue',
    price_display: '₹199 for one day', mrp: 199,
    colors: ['#EE0606', '#000', '#1a56db'], primary_image: null,
    description: 'Ultra-lightweight travel stroller perfect for trips. Compact fold fits in overhead bins. Suitable for infants and toddlers up to 15kg.',
    specifications: [
      { label: 'Age Group', value: '6 Months - 3 Years' },
      { label: 'Weight Capacity', value: 'Up to 15 kg' },
      { label: 'Stroller Weight', value: '5.8 kg' },
      { label: 'Fold Type', value: 'Compact one-hand fold' },
      { label: 'Recline', value: '2-position recline' },
      { label: 'Material', value: 'Aluminium, Oxford fabric' },
    ],
    images: [],
    rental_period: 'Daily / Weekly / Monthly',
    deposit: 500,
  },
  {
    id: 3, name: 'Babyhug Lil Giffee Baby Stroller - Yellow',
    price_display: '₹200 for one day', mrp: 200,
    colors: ['#EE0606', '#000', '#FFD83B'], primary_image: null,
    description: 'Cheerful yellow stroller with comfortable padding and smooth ride wheels. Great for everyday outings with your baby.',
    specifications: [
      { label: 'Age Group', value: '0 - 3 Years' },
      { label: 'Weight Capacity', value: 'Up to 12 kg' },
      { label: 'Color', value: 'Yellow' },
      { label: 'Wheels', value: 'EVA foam wheels' },
    ],
    images: [], rental_period: 'Daily / Weekly / Monthly', deposit: 500,
  },
  {
    id: 4, name: 'Chicco Unico Evo Car Seat - Black',
    price_display: '₹199 for one day', mrp: 199,
    colors: ['#000', '#333'], primary_image: null,
    description: 'Premium car seat suitable from birth to 18kg. Side impact protection, easy installation with ISOFIX or seat belt.',
    specifications: [
      { label: 'Age Group', value: 'Birth to 4 Years' },
      { label: 'Weight Range', value: '0 - 18 kg' },
      { label: 'Installation', value: 'ISOFIX + seat belt' },
      { label: 'Side Impact', value: 'Yes' },
      { label: 'Recline', value: 'Multi-position recline' },
    ],
    images: [], rental_period: 'Daily / Weekly / Monthly', deposit: 1000,
  },
  {
    id: 5, name: 'Joie Car Seat Steadi R129 (Birth to 18 kg) Cobble Stone',
    price_display: '₹2,409 for one month', mrp: 2409,
    colors: ['#888', '#555'], primary_image: null,
    description: 'R129 certified car seat with 360° rotation for easy loading. Extended rear-facing capability keeps baby safer for longer.',
    specifications: [
      { label: 'Age Group', value: 'Birth to 4 Years' },
      { label: 'Weight Range', value: '0 - 18 kg' },
      { label: 'Rotation', value: '360° swivel' },
      { label: 'Certification', value: 'R129 i-Size' },
      { label: 'Installation', value: 'ISOFIX' },
    ],
    images: [], rental_period: 'Monthly', deposit: 2000,
  },
  {
    id: 6, name: 'Chinmay Kids Baby Carrier Bag Adjustable Hands Free 4 in 1',
    price_display: '₹2,509 for 40 days', mrp: 2509,
    colors: ['#EE0606', '#000', '#1a56db'], primary_image: null,
    description: '4-in-1 baby carrier with multiple carrying positions. Ergonomic design supports baby\'s hip development. Adjustable for different body types.',
    specifications: [
      { label: 'Age Group', value: '0 - 36 Months' },
      { label: 'Weight Range', value: 'Up to 15 kg' },
      { label: 'Positions', value: '4 carrying positions' },
      { label: 'Material', value: 'Cotton blend' },
      { label: 'Waist Belt', value: 'Padded waist support' },
    ],
    images: [], rental_period: 'Monthly', deposit: 500,
  },
]

const FAKE_REVIEWS = [
  { id: 1, name: 'Priya',       rating: 5, text: 'Amazing quality! My baby loved it. Delivery was fast and the product was clean and well maintained.' },
  { id: 2, name: 'Anjali',      rating: 4, text: 'Good condition product. Rental process was smooth. Will rent again.' },
  { id: 3, name: 'Sneha Lata',  rating: 5, text: 'Worth every rupee. Great for short trips. Highly recommend BabyZone rentals!' },
]

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#FFD83B' : '#ddd', fontSize: 16 }}>★</span>
      ))}
    </span>
  )
}

export default function RentalDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { addItem }  = useCartStore()
  const { toggle, has } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()

  const [selectedColor,  setSelectedColor]  = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly')
  const [quantity,       setQuantity]       = useState(1)
  const [activeTab,      setActiveTab]      = useState('description')
  const [mainImg,        setMainImg]        = useState(0)
  const [reviewText,     setReviewText]     = useState('')
  const [reviewRating,   setReviewRating]   = useState(5)

  // Try to fetch from API, fallback to static data
  const { data: apiProduct } = useQuery({
    queryKey: ['rental-product', id],
    queryFn:  () => api.get(`/products/${id}/`).then(r => r.data),
    retry: false,
  })

  const product = apiProduct || FALLBACK_RENTALS.find(p => p.id === Number(id)) || FALLBACK_RENTALS[0]

  const images = product.images?.length
    ? product.images.map(img => img.image || img)
    : [product.primary_image || null]

  const PERIOD_PRICES = {
    Daily:   product.mrp,
    Weekly:  Math.round(product.mrp * 6),
    Monthly: Math.round(product.mrp * 20),
  }

  const price = PERIOD_PRICES[selectedPeriod] || product.mrp

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    try {
      await api.post('/orders/cart/', { product_id: product.id, quantity })
      addItem({ product, quantity })
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) { toast.error('Please login to book'); return }
    navigate('/rental-checkout', { state: { product, period: selectedPeriod } })
  }

  const handleWishlist = () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    toggle(product.id)
    toast.success(has(product.id) ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const handleReview = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to write a review'); return }
    if (!reviewText.trim()) { toast.error('Please write a review'); return }
    toast.success('Review submitted!')
    setReviewText('')
  }

  return (
    <div className="container py-4">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Rental Services', to: '/rental-services' },
        { label: product.name },
      ]} />

      {/* ── Top: Image + Details ── */}
      <div className="row g-4 mb-5">

        {/* Left: Image gallery */}
        <div className="col-12 col-md-5">
          {/* Main image */}
          <div style={{
            width: '100%', aspectRatio: '1/1',
            borderRadius: 16, overflow: 'hidden',
            background: '#f8f8f8', border: '1px solid #eee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            {images[mainImg]
              ? <img src={images[mainImg]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ fontSize: 80 }}>🍼</div>
            }
          </div>

          {/* Thumbnails */}
          <div className="d-flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImg(i)}
                style={{
                  width: 70, height: 70, borderRadius: 10,
                  overflow: 'hidden', background: '#f8f8f8',
                  border: `2px solid ${mainImg === i ? 'var(--bz-yellow)' : '#eee'}`,
                  cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {img
                  ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 28 }}>🍼</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product details */}
        <div className="col-12 col-md-7">
          <h4 className="fw-700 mb-2" style={{ lineHeight: 1.4 }}>{product.name}</h4>

          {/* Rating */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <Stars rating={4} />
            <span style={{ fontSize: 13, color: '#888' }}>({FAKE_REVIEWS.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--bz-red)' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 14, color: '#888', marginLeft: 8 }}>
              / {selectedPeriod}
            </span>
          </div>

          {/* Deposit info */}
          <div className="mb-3 p-2 rounded-2" style={{ background: '#fff8e1', fontSize: 13 }}>
            🔒 Refundable deposit: <strong>₹{product.deposit || 500}</strong>
            {' '}(returned when product is back in good condition)
          </div>

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div className="mb-3">
              <p className="fw-600 mb-2" style={{ fontSize: 14 }}>
                Color: <span style={{ color: '#555' }}>{['Red','Black','Blue'][selectedColor] || 'Default'}</span>
              </p>
              <div className="d-flex gap-2">
                {product.colors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: c, cursor: 'pointer',
                      border: selectedColor === i
                        ? '3px solid var(--bz-yellow)'
                        : '2px solid #ddd',
                      boxShadow: selectedColor === i ? '0 0 0 2px #333' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Period selector */}
          <div className="mb-3">
            <p className="fw-600 mb-2" style={{ fontSize: 14 }}>Rental Period:</p>
            <div className="d-flex gap-2">
              {['Daily', 'Weekly', 'Monthly'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`btn btn-sm fw-600 ${selectedPeriod === p ? 'btn-yellow' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: 8, minWidth: 80 }}
                >
                  {p}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
              Daily: ₹{product.mrp} &nbsp;|&nbsp;
              Weekly: ₹{Math.round(product.mrp * 6)} &nbsp;|&nbsp;
              Monthly: ₹{Math.round(product.mrp * 20)}
            </p>
          </div>

          {/* Age group */}
          <div className="mb-3">
            <p className="fw-600 mb-2" style={{ fontSize: 14 }}>Age Group:</p>
            <div className="d-flex gap-2 flex-wrap">
              {['0-6m', '6-12m', '1-3y', '3-5y'].map(a => (
                <span key={a} className="badge rounded-pill"
                  style={{ background: '#f0f0f0', color: '#555', fontSize: 12, padding: '5px 12px' }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <p className="fw-600 mb-2" style={{ fontSize: 14 }}>Quantity:</p>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="btn btn-outline-secondary btn-sm"
                style={{ width: 32, height: 32, padding: 0 }}
              >−</button>
              <span className="fw-700" style={{ minWidth: 32, textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="btn btn-outline-secondary btn-sm"
                style={{ width: 32, height: 32, padding: 0 }}
              >+</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-3 flex-wrap mb-3">
            <button
              onClick={handleBookNow}
              className="btn btn-yellow fw-700 px-5 py-2"
              style={{ borderRadius: 10, fontSize: 15 }}
            >
              Book Now
            </button>
            <button
              onClick={handleAddToCart}
              className="btn btn-outline-secondary fw-700 px-4 py-2"
              style={{ borderRadius: 10 }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="btn btn-outline-secondary py-2"
              style={{ borderRadius: 10, fontSize: 20 }}
            >
              {has(product.id) ? '♥' : '♡'}
            </button>
          </div>

          {/* Check pincode */}
          <div className="d-flex gap-2 align-items-center mt-2">
            <input
              className="form-control form-control-sm"
              placeholder="Enter pincode to check delivery"
              style={{ maxWidth: 200 }}
            />
            <button
              className="btn btn-sm btn-outline-secondary fw-600"
              onClick={() => toast.success('Delivery available in your area!')}
            >
              Check
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specifications / Support / Delivery ── */}
      <div className="mb-4">
        <div className="d-flex gap-0 border-bottom mb-4" style={{ overflowX: 'auto' }}>
          {['description', 'specifications', 'support', 'delivery'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn btn-link fw-600 text-decoration-none px-4 py-2"
              style={{
                borderBottom: activeTab === tab ? '3px solid var(--bz-yellow)' : '3px solid transparent',
                borderRadius: 0,
                color: activeTab === tab ? '#1a1a2e' : '#888',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'delivery' ? 'Delivery & return' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="col-12 col-md-8">

            {/* Description */}
            {activeTab === 'description' && (
              <div>
                <h6 className="fw-700 mb-3">Product Description</h6>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>
                  {product.description || 'Premium quality rental product from BabyZone. All products are thoroughly cleaned, sanitized, and inspected before each rental. Enjoy the convenience of premium baby gear without the full purchase price.'}
                </p>
                <div className="mt-3">
                  <h6 className="fw-700 mb-2">Why Rent from BabyZone?</h6>
                  <ul style={{ fontSize: 14, color: '#555', lineHeight: 2 }}>
                    <li>✅ Sanitized and quality-checked before every rental</li>
                    <li>✅ Free delivery and pickup</li>
                    <li>✅ Flexible rental periods — Daily, Weekly, Monthly</li>
                    <li>✅ Refundable security deposit</li>
                    <li>✅ 24/7 customer support</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications */}
            {activeTab === 'specifications' && (
              <div>
                <h6 className="fw-700 mb-3">Product Specifications</h6>
                <table className="table table-bordered" style={{ fontSize: 14 }}>
                  <tbody>
                    {(product.specifications || []).map((spec, i) => (
                      <tr key={i}>
                        <td className="fw-600" style={{ width: '40%', background: '#f8f8f8' }}>{spec.label}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                    {(!product.specifications || product.specifications.length === 0) && (
                      <tr><td colSpan={2} className="text-muted text-center">No specifications available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Support */}
            {activeTab === 'support' && (
              <div>
                <h6 className="fw-700 mb-3">Customer Support</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="border rounded-3 p-3">
                    <p className="fw-700 mb-1">📞 Call Us</p>
                    <p style={{ fontSize: 14, color: '#555', margin: 0 }}>+123-456-7890 (Mon-Sat, 9am-6pm)</p>
                  </div>
                  <div className="border rounded-3 p-3">
                    <p className="fw-700 mb-1">📧 Email Us</p>
                    <p style={{ fontSize: 14, color: '#555', margin: 0 }}>support@babyzone.com</p>
                  </div>
                  <div className="border rounded-3 p-3">
                    <p className="fw-700 mb-1">💬 WhatsApp</p>
                    <p style={{ fontSize: 14, color: '#555', margin: 0 }}>+123-456-7890</p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery & Return */}
            {activeTab === 'delivery' && (
              <div>
                <h6 className="fw-700 mb-3">Delivery & Return Policy</h6>
                <div style={{ fontSize: 14, color: '#555', lineHeight: 2 }}>
                  <p className="fw-600">🚚 Delivery</p>
                  <ul>
                    <li>Free delivery within city limits</li>
                    <li>Delivery within 1-2 business days after booking</li>
                    <li>Our staff will deliver and demonstrate product usage</li>
                  </ul>
                  <p className="fw-600 mt-3">🔄 Return</p>
                  <ul>
                    <li>Our staff will pick up the product at your selected return date</li>
                    <li>Product must be returned in the same condition</li>
                    <li>Security deposit refunded within 3-5 business days</li>
                    <li>Damage charges may apply for broken/lost items</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="row g-4">
        {/* Existing reviews */}
        <div className="col-12 col-md-8">
          <h5 className="fw-700 mb-4">Reviews ({FAKE_REVIEWS.length})</h5>
          <div className="d-flex flex-column gap-3">
            {FAKE_REVIEWS.map(r => (
              <div key={r.id} className="border rounded-3 p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--bz-pink)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700,
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="fw-700 mb-0" style={{ fontSize: 14 }}>{r.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Write review */}
        <div className="col-12 col-md-4">
          <h5 className="fw-700 mb-4">Write Review</h5>
          <form onSubmit={handleReview}>
            <div className="mb-3">
              <p className="fw-600 mb-1" style={{ fontSize: 14 }}>Your Rating:</p>
              <div className="d-flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <span
                    key={s}
                    onClick={() => setReviewRating(s)}
                    style={{
                      fontSize: 28, cursor: 'pointer',
                      color: s <= reviewRating ? '#FFD83B' : '#ddd',
                    }}
                  >★</span>
                ))}
              </div>
            </div>
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
            <button type="submit" className="btn btn-yellow fw-700 w-100">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}