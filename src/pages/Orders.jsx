import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import api from '../utils/api'
import { useAuthStore } from '../store'

const STATUS_COLOR = {
  placed:     '#dbeafe',
  dispatched: '#fef9c3',
  transit:    '#ffedd5',
  delivered:  '#dcfce7',
  cancelled:  '#fee2e2',
}

const STATUS_LABEL = {
  placed:     'Order Placed',
  dispatched: 'Dispatched',
  transit:    'In Transit',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

export default function Orders() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated])

  // Refetch on mount — ensures fresh data after payment
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders/list/').then(r => r.data.results || r.data),
    enabled: isAuthenticated,
    staleTime: 0,          // always refetch on mount
    refetchOnMount: true,
  })

  if (!isAuthenticated) return null

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: 'var(--bz-pink)' }} />
      <p className="mt-3 text-muted">Loading your orders...</p>
    </div>
  )

  if (isError) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: 56 }}>⚠️</div>
      <h5 className="fw-700 mt-3">Could not load orders</h5>
      <button className="btn btn-yellow mt-3 px-5" onClick={() => qc.invalidateQueries(['orders'])}>
        Try Again
      </button>
    </div>
  )

  return (
    <div className="container py-4">
      <h2 className="fw-700 mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: 72 }}>📦</div>
          <h5 className="fw-700 mt-3 mb-2">No orders yet</h5>
          <p className="text-muted mb-4">Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-yellow px-5 fw-700">Shop Now</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map(order => (
            <div key={order.id} className="border rounded-3 p-3 p-md-4">
              {/* Order header */}
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <p className="fw-700 mb-0" style={{ fontSize: 15 }}>Order #{order.id}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill fw-600" style={{
                    background: STATUS_COLOR[order.status] || '#f0f0f0',
                    color: '#333', fontSize: 12, padding: '5px 10px'
                  }}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                  <span className="fw-700" style={{ color: 'var(--bz-red)', fontSize: 15 }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Product images */}
              <div className="d-flex gap-2 overflow-x-auto mb-3" style={{ scrollbarWidth: 'none' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{
                    width: 60, height: 60, borderRadius: 10,
                    overflow: 'hidden', background: '#f8f8f8', flexShrink: 0,
                    border: '1px solid #eee'
                  }}>
                    {item.product_image
                      ? <img src={item.product_image} alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ fontSize: 24 }}>🍼</div>
                    }
                  </div>
                ))}
              </div>

              {/* Product names */}
              <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                {order.items?.map(i => i.product_name).join(', ')}
              </p>

              {/* Payment info */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span style={{ fontSize: 13, color: '#888' }}>
                  {order.payment_method === 'cod' ? '💵 Cash on Delivery' : '💳 Paid Online'}
                  {'  ·  '}
                  <span style={{
                    color: order.payment_status === 'paid' ? 'green' : 'orange',
                    fontWeight: 600
                  }}>
                    {order.payment_status === 'paid' ? 'Payment confirmed' : 'Payment pending'}
                  </span>
                </span>
                <Link to={`/orders/${order.id}/track`} className="btn btn-yellow btn-sm px-4 fw-700">
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}