import { useState, useContext, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiMinus, FiPlus, FiMapPin, FiChevronRight } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { useCartStore, useWishlistStore, useAuthStore } from '../store'
import { AuthModalContext } from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import toast from 'react-hot-toast'

const AGE_GROUPS = ['0-6m', '3-4y', '4-5y']
const TABS = [
  { key: 'description',  label: 'Description'      },
  { key: 'specification', label: 'Specification'   },
  { key: 'expert',       label: 'Expert Advice'     },
  { key: 'delivery',     label: 'Delivery & return' },
]

export default function ProductDetail() {
  const { slug }  = useParams()
  const scrollRef = useRef(null)

  const [qty,           setQty]           = useState(1)
  const [selectedImg,   setSelectedImg]   = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedAge,   setSelectedAge]   = useState(0)
  const [activeTab,     setActiveTab]     = useState('description')
  const [pincode,       setPincode]       = useState('')
  const [reviewText,    setReviewText]    = useState('')
  const [reviewRating,  setReviewRating]  = useState(5)

  const { addItem }         = useCartStore()
  const { toggle, has }     = useWishlistStore()
  const { isAuthenticated } = useAuthStore()
  const { openLogin }       = useContext(AuthModalContext)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}/`).then(r => r.data),
  })

  const { data: similar = [] } = useQuery({
    queryKey: ['similar', product?.category_name],
    queryFn: () => api.get('/products/', {
      params: { search: product?.category_name, page_size: 8 }
    }).then(r => r.data.results || []),
    enabled: !!product,
  })

  const handleAddToCart = async () => {
    if (!isAuthenticated) { openLogin(); return }
    try {
      const { data } = await api.post('/orders/cart/', { product_id: product.id, quantity: qty })
      addItem({ id: data.id, product, quantity: qty })
      toast.success('Added to cart!')
    } catch { toast.error('Failed to add to cart') }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    window.location.href = '/checkout'
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { openLogin(); return }
    try {
      await api.post(`/products/${product.id}/review/`, { rating: reviewRating, comment: reviewText })
      toast.success('Review submitted!')
      setReviewText('')
    } catch { toast.error('Failed to submit review') }
  }

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: 'var(--bz-pink)' }} />
    </div>
  )
  if (!product) return (
    <div className="container py-5 text-center text-muted">Product not found</div>
  )

  const imgs     = product.images?.length ? product.images : [{ image: null }]
  const isWished = has(product.id)
  const price    = product.price || product.mrp
  const catSlug  = product.category_name?.toLowerCase().replace(/ /g, '-') || ''

  return (
    <div className="container-fluid px-3 px-md-4 py-3">

      {/* ── Top: image + info ── */}
      <div className="row g-4 mb-4">

        {/* Left: images */}
        <div className="col-12 col-md-5">
          {/* Main image */}
          <div className="border rounded-3 overflow-hidden mb-3"
            style={{ aspectRatio: '1', background: '#f8f8f8', position: 'relative' }}>
            {imgs[selectedImg]?.image
              ? <img src={imgs[selectedImg].image} alt={product.name}
                  className="w-100 h-100" style={{ objectFit: 'contain' }} />
              : <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ fontSize: 80 }}>🍼</div>
            }
            {/* Wishlist on image */}
            <button
              onClick={() => toggle(product.id)}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'white', border: 'none', borderRadius: '50%',
                width: 34, height: 34, display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
            >
              {isWished
                ? <FaHeart size={16} color="var(--bz-red)" />
                : <FiHeart size={16} color="#888" />
              }
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="d-flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {imgs.map((img, i) => (
              <button key={i} onClick={() => setSelectedImg(i)}
                style={{
                  width: 64, height: 64, flexShrink: 0, padding: 0,
                  background: '#f8f8f8', borderRadius: 8, overflow: 'hidden',
                  border: selectedImg === i ? '2px solid var(--bz-yellow)' : '2px solid #eee',
                  cursor: 'pointer',
                }}>
                {img.image
                  ? <img src={img.image} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  : <span style={{ fontSize: 24 }}>🍼</span>
                }
              </button>
            ))}
          </div>
        </div>

        {/* Right: product info */}
        <div className="col-12 col-md-7">
          <h2 className="fw-700 mb-1" style={{ fontSize: 20 }}>{product.name}</h2>

          {/* Price row */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fw-700" style={{ fontSize: 24, color: 'var(--bz-red)' }}>
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
            {product.discount_percent > 0 && (
              <>
                <span className="text-muted text-decoration-line-through" style={{ fontSize: 15 }}>
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
                <span className="badge" style={{ background: 'var(--bz-red)', color: 'white', fontSize: 12 }}>
                  {product.discount_percent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color dots */}
          {product.colors?.length > 0 && (
            <div className="mb-3">
              <p className="fw-600 mb-2" style={{ fontSize: 13 }}>Color</p>
              <div className="d-flex gap-2">
                {product.colors.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)}
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: c, border: 'none', cursor: 'pointer',
                      outline: selectedColor === i ? `3px solid var(--bz-yellow)` : '2px solid #ddd',
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Age Group — pill buttons matching design */}
          <div className="mb-3">
            <p className="fw-600 mb-2" style={{ fontSize: 13 }}>Age Group</p>
            <div className="d-flex gap-2 flex-wrap">
              {AGE_GROUPS.map((a, i) => (
                <button key={a} onClick={() => setSelectedAge(i)}
                  style={{
                    padding: '4px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    fontWeight: 600, border: '1px solid var(--bz-pink)',
                    background: selectedAge === i ? 'var(--bz-pink)' : 'white',
                    color: '#1a1a2e',
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <p className="fw-600 mb-2" style={{ fontSize: 13 }}>Quantity</p>
            <div className="d-flex align-items-center gap-0"
              style={{ border: '1px solid #ddd', borderRadius: 8, display: 'inline-flex', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ width: 36, height: 36, background: 'white', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                <FiMinus size={14} />
              </button>
              <span className="fw-700 px-3" style={{ minWidth: 32, textAlign: 'center', lineHeight: '36px' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                style={{ width: 36, height: 36, background: 'white', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Add to cart + Buy now */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button onClick={handleAddToCart} className="btn btn-yellow px-4 py-2 fw-700">
              Add to cart
            </button>
            <button onClick={handleBuyNow} className="btn btn-outline-yellow px-4 py-2 fw-700">
              Buy Now
            </button>
          </div>

          {/* Pincode checker */}
          <div className="d-flex align-items-center gap-2">
            <FiMapPin color="#888" size={16} />
            <input
              value={pincode}
              onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Check Pincode"
              className="form-control form-control-sm"
              style={{ maxWidth: 160 }}
              maxLength={6}
            />
            <button className="btn btn-yellow btn-sm px-3 fw-700">Check</button>
          </div>
          {pincode.length === 6 && (
            <p style={{ fontSize: 12, color: 'green', marginTop: 6 }}>
              ✅ Delivery available for {pincode}
            </p>
          )}
        </div>
      </div>

      {/* ── Tabs: Description / Specification / Expert Advice / Delivery ── */}
      <div className="border rounded-3 mb-5 overflow-hidden">
        {/* Tab headers */}
        <div className="d-flex border-bottom overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="btn border-0 px-4 py-3 fw-600 flex-shrink-0"
              style={{
                fontSize: 13, borderRadius: 0,
                background: activeTab === tab.key ? '#fff' : '#fafafa',
                color: activeTab === tab.key ? '#1a1a2e' : '#888',
                borderBottom: activeTab === tab.key
                  ? '3px solid var(--bz-yellow)'
                  : '3px solid transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4" style={{ fontSize: 14, color: '#555', minHeight: 120 }}>
          {activeTab === 'description' && (
            <p style={{ lineHeight: 1.8 }}>
              {product.description || 'Premium quality baby product from BabyZone. Safe, comfortable and designed for your little one.'}
            </p>
          )}
          {activeTab === 'specification' && (
            <div>
              <p style={{ lineHeight: 1.8 }}>
                {product.size_info || 'Available in multiple sizes. Please refer to the size chart for accurate measurements.'}
              </p>
              {product.colors?.length > 0 && <p><strong>Colors available:</strong> {product.colors.join(', ')}</p>}
              {product.gender && <p><strong>Gender:</strong> {product.gender}</p>}
              {product.brand_name && <p><strong>Brand:</strong> {product.brand_name}</p>}
            </div>
          )}
          {activeTab === 'expert' && (
            <p style={{ lineHeight: 1.8 }}>
              {product.expert_advice || 'Our experts recommend this product for babies. Ensure proper supervision during use. Always check for allergies before first use.'}
            </p>
          )}
          {activeTab === 'delivery' && (
            <div style={{ lineHeight: 1.8 }}>
              <p>{product.delivery_info || 'Free delivery on orders above ₹499. Standard delivery in 3-5 business days.'}</p>
              <p>Easy 7-day returns on all products. 100% authentic products guaranteed.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews + Write review ── */}
      <div className="mb-5">
        <h4 className="fw-700 mb-4">Reviews</h4>
        <div className="row g-4">
          {/* Left: existing reviews */}
          <div className="col-12 col-md-8">
            {product.reviews?.length > 0 ? (
              <div className="row g-3">
                {product.reviews.map(r => (
                  <div key={r.id} className="col-12 col-sm-6">
                    <div className="border rounded-3 p-3">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-700"
                          style={{ width: 40, height: 40, background: 'var(--bz-pink)', fontSize: 14, flexShrink: 0 }}>
                          {r.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="fw-700 mb-0" style={{ fontSize: 14 }}>{r.username}</p>
                          <div style={{ color: 'var(--bz-yellow)', fontSize: 14 }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: 14 }}>No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Right: write review form */}
          <div className="col-12 col-md-4">
            <div className="border rounded-3 p-4">
              <h6 className="fw-700 mb-3">Write Review</h6>
              <form onSubmit={handleReview}>
                {/* Star rating */}
                <div className="d-flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button"
                      onClick={() => setReviewRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                      <span style={{ fontSize: 22, color: s <= reviewRating ? 'var(--bz-yellow)' : '#ddd' }}>★</span>
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="form-control mb-3"
                  rows={4}
                  required
                  style={{ fontSize: 13, resize: 'none' }}
                />
                <button type="submit" className="btn btn-yellow w-100 fw-700">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── You might also like — horizontal scroll ── */}
      {similar.filter(p => p.id !== product.id).length > 0 && (
        <div className="mb-5">
          <h4 className="fw-700 mb-4">You might also like</h4>
          <div style={{ position: 'relative' }}>
            <div
              ref={scrollRef}
              style={{
                display: 'flex', gap: 16,
                overflowX: 'auto', scrollBehavior: 'smooth',
                scrollbarWidth: 'none', paddingBottom: 8,
              }}
            >
              {similar.filter(p => p.id !== product.id).slice(0, 8).map(p => (
                <div key={p.id} style={{ flex: '0 0 220px', minWidth: 220 }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 450, behavior: 'smooth' })}
              style={{
                position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--bz-yellow)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 2,
              }}
            >
              <FiChevronRight size={20} color="#1a1a2e" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}