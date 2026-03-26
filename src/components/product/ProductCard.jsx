import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useWishlistStore, useCartStore, useAuthStore } from '../../store'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function ProductCard({ product, showBookNow = false }) {
  const { toggle, has }     = useWishlistStore()
  const { addItem }         = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const isWished            = has(product.id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    try {
      const { data } = await api.post('/orders/cart/', { product_id: product.id, quantity: 1 })
      addItem({ id: data.id, product, quantity: 1 })
      toast.success('Added to cart!')
    } catch { toast.error('Failed to add to cart') }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  return (
    <Link to={`/products/${product.slug || product.id}`} className="text-decoration-none">
      <div className="product-card">
        <div className="card-img-wrap">

          {/* img-inner handles overflow+scale so wishlist btn stays visible */}
          <div className="img-inner">
            {product.primary_image
              ? <img src={product.primary_image} alt={product.name} />
              : <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ fontSize: 48 }}>🍼</div>
            }
          </div>

          {/* Discount badge */}
          {product.discount_percent > 0 && (
            <span className="discount-badge">{product.discount_percent}% OFF</span>
          )}

          {/* Wishlist btn — outside img-inner so it's never clipped */}
          <button onClick={handleWishlist} className="wishlist-btn">
            {isWished
              ? <FaHeart size={14} color="var(--bz-red)" />
              : <FiHeart size={14} color="#888" />
            }
          </button>
        </div>

        <div className="card-body">
          <p className="product-name">{product.name}</p>
          <p className="product-price">
            Price : <strong>₹{Number(product.mrp).toLocaleString('en-IN')}</strong>
          </p>
          {product.age_group && (
            <p className="product-age">Age: 0-12m, 3-4y, 4-5</p>
          )}
          {product.colors?.length > 0 && (
            <div className="color-dots">
              <span style={{ fontSize: 12, color: '#888' }}>Color:</span>
              {product.colors.slice(0, 4).map((c, i) => (
                <span key={i} className="color-dot" style={{ background: c }} />
              ))}
            </div>
          )}
          <div className="card-actions">
            {showBookNow ? (
              <button onClick={handleAddToCart} className="btn btn-yellow">Shop Now</button>
            ) : (
              <>
                <button onClick={handleAddToCart} className="btn btn-yellow">Buy Now</button>
                <button onClick={handleAddToCart} className="btn btn-outline-yellow">Add to cart</button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}