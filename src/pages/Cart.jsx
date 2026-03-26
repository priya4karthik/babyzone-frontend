import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiChevronRight } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../utils/api'
import { useCartStore, useAuthStore } from '../store'
import ProductCard from '../components/product/ProductCard'
import toast from 'react-hot-toast'

export default function Cart() {
  const { isAuthenticated } = useAuthStore()
  const { setItems } = useCartStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const scrollRef = useRef(null)

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/orders/cart/').then(r => r.data.results || r.data),
    enabled: isAuthenticated,
  })

  useEffect(() => { if (cartItems.length) setItems(cartItems) }, [cartItems])

  const removeMutation = useMutation({
    mutationFn: (id) => api.delete(`/orders/cart/${id}/`),
    onSuccess: () => { qc.invalidateQueries(['cart']); toast.success('Removed from cart') },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => api.patch(`/orders/cart/${id}/`, { quantity }),
    onSuccess: () => qc.invalidateQueries(['cart']),
  })

  const { data: similar = [] } = useQuery({
    queryKey: ['cart-similar'],
    queryFn: () => api.get('/products/', { params: { is_new_arrival: true } }).then(r => r.data.results || []),
  })

  const scrollSimilar = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' })
  }

  if (!isAuthenticated) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: 64 }}>🛒</div>
      <h4 className="fw-700 mt-3">Please login to view your cart</h4>
      <Link to="/" className="btn btn-yellow px-5 mt-3">Go Home</Link>
    </div>
  )

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <h2 className="fw-700 text-center mb-4">Cart</h2>

      {isLoading
        ? <div className="text-center py-4"><div className="spinner-border" style={{ color: 'var(--bz-pink)' }} /></div>
        : cartItems.length === 0
          ? (
            <div className="text-center py-5">
              <div style={{ fontSize: 64 }}>🛒</div>
              <p className="text-muted fw-600 mt-3">Your cart is empty</p>
              <Link to="/products" className="btn btn-yellow px-5 mt-2">Shop Now</Link>
            </div>
          ) : (
            <>
              {/* Cart table */}
              <div className="table-responsive mb-5">
                <table className="table cart-table align-middle">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>Age</th>
                      <th>Price</th>
                      <th>Remove</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f8f8f8' }}>
                            {item.product?.primary_image
                              ? <img src={item.product.primary_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: 28 }}>🍼</div>
                            }
                          </div>
                        </td>
                        <td>
                          <p className="fw-600 mb-0" style={{ fontSize: 13, maxWidth: 220 }}>{item.product?.name}</p>
                        </td>
                        <td>
                          <select
                            value={item.quantity}
                            onChange={e => updateMutation.mutate({ id: item.id, quantity: Number(e.target.value) })}
                            className="form-select form-select-sm"
                            style={{ width: 70 }}
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: 13 }}>{item.age || '0-12M'}</td>
                        <td className="fw-700">₹{Number(item.total || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <button onClick={() => removeMutation.mutate(item.id)} className="btn btn-link p-0 text-danger">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                        <td>
                          {/* Checkout button only on last row */}
                          {item === cartItems[cartItems.length - 1] && (
                            <button onClick={() => navigate('/checkout')} className="btn btn-yellow px-4 py-2 fw-700">
                              Checkout
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* You might also like — horizontal scroll with arrow */}
              {similar.length > 0 && (
                <div className="mb-4" style={{ background: 'var(--bz-pink)', padding: '24px 0', borderRadius: 0, margin: '0 -16px' }}>
                  <div className="container-fluid px-3 px-md-4">
                    <h5 className="fw-700 mb-3">You might also like</h5>
                    <div style={{ position: 'relative' }}>
                      <div
                        ref={scrollRef}
                        style={{
                          display: 'flex', gap: 16,
                          overflowX: 'auto', scrollBehavior: 'smooth',
                          scrollbarWidth: 'none', paddingBottom: 8,
                        }}
                      >
                        {similar.map(p => (
                          <div key={p.id} style={{ flex: '0 0 220px', minWidth: 220 }}>
                            <ProductCard product={p} />
                          </div>
                        ))}
                      </div>
                      {/* Right scroll arrow — matches design */}
                      <button
                        onClick={scrollSimilar}
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
                </div>
              )}

              {/* Continue shopping */}
              <div className="text-center mt-4">
                <Link to="/products" className="btn btn-yellow px-5 py-2 fw-700">Continue shopping</Link>
              </div>
            </>
          )
      }
    </div>
  )
}