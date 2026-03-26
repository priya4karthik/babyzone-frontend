import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const STEPS = [
  {
    key: 'placed',
    label: 'Order Placed',
    icon: '🛒',
    getDetail: (order) => order?.created_at
      ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '',
  },
  {
    key: 'dispatched',
    label: 'Order Dispatched',
    icon: '📦',
    getDetail: (order) => order?.dispatched_at
      ? new Date(order.dispatched_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '',
  },
  {
    key: 'transit',
    label: 'Order in transit',
    icon: '🚚',
    getDetail: () => 'Reached at Tenkasi, Post office',
  },
  {
    key: 'delivered',
    label: 'Delivered successfully',
    icon: '👍',
    getDetail: () => 'Not delivered yet',
  },
]

const STATUS_IDX = { placed: 0, dispatched: 1, transit: 2, delivered: 3 }

export default function TrackOrder() {
  const { id } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}/`).then(r => r.data),
  })

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: 'var(--bz-pink)' }} />
    </div>
  )

  const currentStep = STATUS_IDX[order?.status] ?? 0
  const firstItem = order?.items?.[0]

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="border rounded-3 overflow-hidden">

            {/* Order info header */}
            <div className="p-4 border-bottom">
              <h5 className="fw-700 mb-3">Your Order</h5>
              <div className="d-flex gap-3">
                {/* Product image */}
                <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', background: '#f8f8f8', flexShrink: 0 }}>
                  {firstItem?.product_image
                    ? <img src={firstItem.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: 28 }}>🍼</div>
                  }
                </div>
                {/* Order details */}
                <div style={{ fontSize: 13 }}>
                  <p className="fw-700 mb-1" style={{ lineHeight: 1.4 }}>{firstItem?.product_name || 'Your product'}</p>
                  <p className="text-muted mb-1">
                    Order no: #{order?.id} | {order?.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-IN')
                      : ''
                    }
                  </p>
                  <p className="text-muted mb-1">
                    {order?.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    {order?.total ? ` ₹${Number(order.total).toLocaleString('en-IN')}` : ''}
                  </p>
                  <p className="text-muted mb-0">Exp. Delivery by Sun, Aug 31</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4">
              {STEPS.map((step, i) => {
                const done = i <= currentStep
                const isLast = i === STEPS.length - 1
                return (
                  <div key={step.key} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                    {/* Vertical connector line */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute',
                        left: 19, top: 40,
                        width: 2,
                        height: 'calc(100% - 0px)',
                        background: done ? 'var(--bz-yellow)' : '#ddd',
                        borderLeft: done ? 'none' : '2px dashed #ddd',
                      }} />
                    )}

                    {/* Circle icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: done ? 'var(--bz-pink)' : '#f0f0f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0, zIndex: 1,
                      border: done ? '2px solid var(--bz-pink-dark)' : '2px solid #ddd',
                    }}>
                      {step.icon}
                    </div>

                    {/* Step info */}
                    <div style={{ paddingBottom: isLast ? 0 : 28 }}>
                      <h6 style={{
                        fontSize: 14, fontWeight: 700, margin: 0,
                        paddingTop: 8,
                        color: done ? '#1a1a2e' : '#aaa',
                      }}>
                        {step.label}
                      </h6>
                      <p style={{ fontSize: 12, color: '#888', margin: 0, marginTop: 2 }}>
                        {step.getDetail(order)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}