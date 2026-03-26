import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useCartStore, useWishlistStore, useAuthStore } from '../store'
import toast from 'react-hot-toast'

export default function RentalServices() {
  const [period, setPeriod] = useState('Monthly')
  const [sort,   setSort]   = useState('-created_at')
  const [gender, setGender] = useState([])
  const [age,    setAge]    = useState([])
  const navigate = useNavigate()

  const { addItem }          = useCartStore()
  const { toggle, has }      = useWishlistStore()
  const { isAuthenticated }  = useAuthStore()

  const { data } = useQuery({
    queryKey: ['rental-products', period, sort],
    queryFn:  () => api.get('/products/', {
      params: { category: 'rental-services', ordering: sort }
    }).then(r => r.data),
  })

  const FALLBACK_RENTALS = [
    { id: 1, name: 'LuvLap Galaxy Baby Stroller for 03 Years, 5-Point Safety Harness',         price_display: '₹199 for One day',      mrp: 199,  colors: ['#EE0606','#000','#1a56db'], primary_image: null },
    { id: 2, name: 'Lightweight & Compact Tour Infant Travel Stroller with Compact Fold - Blue', price_display: '₹199 for one day',      mrp: 199,  colors: ['#EE0606','#000','#1a56db'], primary_image: null },
    { id: 3, name: 'Babyhug Lil Giffee Baby Stroller - Yellow',                                 price_display: '₹200 for one day',      mrp: 200,  colors: ['#EE0606','#000','#1a56db'], primary_image: null },
    { id: 4, name: 'Chicco Unico Evo Car Seat - Black',                                         price_display: '₹199 for one day',      mrp: 199,  colors: ['#EE0606','#000','#1a56db'], primary_image: null },
    { id: 5, name: 'Joie Car Seat Steadi R129 (Birth to 18 kg) Cobble Stone',                  price_display: '₹2,409 for one month',  mrp: 2409, colors: ['#EE0606','#000','#1a56db'], primary_image: null },
    { id: 6, name: 'Chinmay Kids Baby Carrier Bag Adjustable Hands Free 4 in 1',               price_display: '₹2,509 for 40 days',    mrp: 2509, colors: ['#EE0606','#000','#1a56db'], primary_image: null },
  ]

  const products = data?.results?.length ? data.results : FALLBACK_RENTALS

  // ✅ Add to cart handler
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    try {
      await api.post('/orders/cart/', { product_id: product.id, quantity: 1 })
      addItem({ product, quantity: 1 })
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  // ✅ Wishlist toggle handler
  const handleWishlist = (productId) => {
    if (!isAuthenticated) { toast.error('Please login to save wishlist'); return }
    toggle(productId)
    toast.success(has(productId) ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  // ✅ Sidebar filter toggle
  const toggleFilter = (list, setList, value) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Rental services' }]} />

      <div className="row g-4">

        {/* ── Sidebar filters ── */}
        <div className="col-md-3 d-none d-md-block">
          <div className="filter-sidebar">
            <h5>Filters</h5>

            <div className="mb-3">
              <h6>Gender</h6>
              {['Boy', 'Girl'].map(g => (
                <div key={g} className="form-check">
                  <input
                    className="form-check-input" type="checkbox"
                    id={`rg-${g}`}
                    checked={gender.includes(g)}
                    onChange={() => toggleFilter(gender, setGender, g)}
                  />
                  <label className="form-check-label" htmlFor={`rg-${g}`}>{g}</label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <h6>Age group</h6>
              {['0-6 months', '7-12 months', 'Kids', 'Adults'].map(a => (
                <div key={a} className="form-check">
                  <input
                    className="form-check-input" type="checkbox"
                    checked={age.includes(a)}
                    onChange={() => toggleFilter(age, setAge, a)}
                  />
                  <label className="form-check-label">{a}</label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <h6>Brands</h6>
              {['Babyhug', 'Babyoye', 'Kookie kids', "Carter's", 'Dapper Dudes'].map(b => (
                <div key={b} className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">{b}</label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <h6>Price</h6>
              {['₹ 0-250', '₹ 250-1000', '₹ 1000-3000', '₹ 3000-5000'].map(p => (
                <div key={p} className="form-check">
                  <input className="form-check-input" type="radio" name="rprice" />
                  <label className="form-check-label">{p}</label>
                </div>
              ))}
            </div>

            {/* ✅ Clear filters button */}
            {(gender.length > 0 || age.length > 0) && (
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => { setGender([]); setAge([]) }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="col-12 col-md-9">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h4 className="fw-700 mb-0">Rental services</h4>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-600" style={{ fontSize: 14 }}>Period</span>
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className="form-select form-select-sm" style={{ width: 'auto' }}>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-600" style={{ fontSize: 14 }}>Sort by</span>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="form-select form-select-sm" style={{ width: 'auto' }}>
                  <option value="-created_at">New arrivals</option>
                  <option value="mrp">Price: Low to High</option>
                  <option value="-mrp">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {products.map((p, i) => (
              <div key={p.id || i} className="col-6 col-sm-4">
                <div className="product-card">
                  <div className="card-img-wrap">
                    {p.primary_image
                      ? <img src={p.primary_image} alt={p.name} />
                      : <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ fontSize: 48 }}>🍼</div>
                    }
                    {/* ✅ Working wishlist button */}
                    <button
                      className="wishlist-btn"
                      onClick={() => handleWishlist(p.id)}
                      style={{ color: has(p.id) ? 'red' : undefined }}
                    >
                      {has(p.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="card-body">
                    <p className="product-name">{p.name}</p>
                    <p className="product-price">
                      Price: <strong>{p.price_display || `₹${Number(p.mrp).toLocaleString('en-IN')}`}</strong>
                    </p>
                    <p className="product-age">Age: 0-12m, 3-4y, 4-5</p>
                    <div className="color-dots">
                      <span style={{ fontSize: 12, color: '#888' }}>Color:</span>
                      {(p.colors || ['#EE0606', '#000', '#1a56db']).slice(0, 3).map((c, ci) => (
                        <span key={ci} className="color-dot" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="card-actions">
                      {/* ✅ Book Now → rental checkout */}
                      <button
                        onClick={() => navigate('/checkout', { state: { product: p, period } })}
                        className="btn btn-yellow"
                      >
                        Book Now
                      </button>
                      {/* ✅ Working Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="btn btn-outline-yellow"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-end gap-2 mt-4">
            <span className="fw-600" style={{ fontSize: 14 }}>Page</span>
            {[1, 2, 3].map(n => (
              <button key={n}
                className={`btn btn-sm rounded-circle ${n === 1 ? 'btn-yellow' : 'btn-outline-secondary'}`}
                style={{ width: 32, height: 32 }}
              >{n}</button>
            ))}
            <span>.......... 10</span>
          </div>
        </div>
      </div>
    </div>
  )
}