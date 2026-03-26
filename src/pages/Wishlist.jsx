import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useWishlistStore, useCartStore, useAuthStore } from '../store'
import { AuthModalContext } from '../components/layout/Layout'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items: wishlistIds, toggle } = useWishlistStore()
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { openLogin } = useContext(AuthModalContext)

  // Fetch product details for all wishlisted IDs
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['wishlist-products', wishlistIds],
    queryFn: async () => {
      if (!wishlistIds.length) return []
      const results = await Promise.all(
        wishlistIds.map(id => api.get(`/products/${id}/`).then(r => r.data).catch(() => null))
      )
      return results.filter(Boolean)
    },
    enabled: wishlistIds.length > 0,
  })

  const handleRemove = (productId) => {
    toggle(productId)
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) { openLogin(); return }
    try {
      const { data } = await api.post('/orders/cart/', { product_id: product.id, quantity: 1 })
      addItem({ id: data.id, product, quantity: 1 })
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <FiHeart size={24} color="var(--bz-red)" />
        <h3 className="fw-700 mb-0">My Wishlist</h3>
        {wishlistIds.length > 0 && (
          <span className="badge rounded-pill" style={{ background: 'var(--bz-pink)', color: '#1a1a2e', fontSize: 13 }}>
            {wishlistIds.length} item{wishlistIds.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Empty state */}
      {wishlistIds.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: 72 }}>🤍</div>
          <h5 className="fw-700 mt-3 mb-2">Your wishlist is empty</h5>
          <p className="text-muted mb-4" style={{ fontSize: 14 }}>
            Save items you love by clicking the heart icon on any product
          </p>
          <Link to="/products" className="btn btn-yellow px-5">Start Shopping</Link>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && wishlistIds.length > 0 && (
        <div className="row g-3">
          {wishlistIds.map((_, i) => (
            <div key={i} className="col-6 col-sm-4 col-lg-3">
              <div className="product-card placeholder-glow">
                <div className="card-img-wrap"><span className="placeholder w-100 h-100" /></div>
                <div className="card-body">
                  <span className="placeholder w-75 d-block mb-2" />
                  <span className="placeholder w-50 d-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {!isLoading && products.length > 0 && (
        <div className="row g-3">
          {products.map(product => (
            <div key={product.id} className="col-6 col-sm-4 col-lg-3">
              <div className="product-card" style={{ position: 'relative' }}>
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product.id)}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 2,
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: 30, height: 30, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                  }}
                >
                  <FiTrash2 size={14} color="var(--bz-red)" />
                </button>

                {/* Discount badge */}
                {product.discount_percent > 0 && (
                  <span className="discount-badge">{product.discount_percent}% OFF</span>
                )}

                {/* Product image */}
                <Link to={`/products/${product.slug || product.id}`} className="text-decoration-none">
                  <div className="card-img-wrap">
                    {product.primary_image
                      ? <img src={product.primary_image} alt={product.name} />
                      : <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: 48 }}>🍼</div>
                    }
                  </div>
                </Link>

                {/* Product info */}
                <div className="card-body">
                  <Link to={`/products/${product.slug || product.id}`} className="text-decoration-none">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">
                      Price : <strong>₹{Number(product.mrp).toLocaleString('en-IN')}</strong>
                    </p>
                  </Link>

                  {/* Actions */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-yellow d-flex align-items-center gap-1"
                      style={{ fontSize: 13 }}
                    >
                      <FiShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="btn btn-outline-yellow"
                      style={{ fontSize: 13 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue shopping */}
      {products.length > 0 && (
        <div className="text-center mt-5">
          <Link to="/products" className="btn btn-outline-yellow px-5">Continue Shopping</Link>
        </div>
      )}
    </div>
  )
}