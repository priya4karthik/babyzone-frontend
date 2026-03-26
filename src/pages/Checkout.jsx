import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore, useAuthStore } from '../store'
import api from '../utils/api'
import toast from 'react-hot-toast'

// Load Razorpay script dynamically
function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState('razorpay')

  const [form, setForm] = useState({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    phone:  '',
    address: '',
    city:    '',
    state:   '',
    pincode: '',
    country: 'India',
    saveInfo: false,
    newsletter: false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const subtotal  = items.reduce((s, i) => s + Number(i.product?.mrp || 0) * i.quantity, 0)
  const delivery  = subtotal >= 499 ? 0 : 99
 
  const gst      = parseFloat(((subtotal + delivery) * 0.18).toFixed(2))
   const total    = parseFloat((subtotal + delivery + gst).toFixed(2)); // Final lock

  // ── Razorpay payment flow ──────────────────────────────────────
  const handleRazorpay = async (orderData) => {
    const loaded = await loadRazorpay()
    if (!loaded) { toast.error('Razorpay failed to load. Check your connection.'); return }

    const options = {
      key:      orderData.key,
      amount:   orderData.amount,
      currency: orderData.currency || 'INR',
      name:     'BabyZone',
      description: 'Baby Products Order',
      order_id: orderData.razorpay_order_id,
      prefill: {
        name:    `${form.first_name} ${form.last_name}`.trim(),
        email:   form.email,
        contact: form.phone,
      },
      theme: { color: '#FFD83B' },
      handler: async (response) => {
        // Verify payment on backend
        try {
          await api.post('/orders/verify-payment/', {
            order_id:                orderData.order_id,
            razorpay_payment_id:     response.razorpay_payment_id,
            razorpay_order_id:       response.razorpay_order_id,
            razorpay_signature:      response.razorpay_signature,
          })
          clearCart()
          toast.success('Payment successful! Order placed.')
          navigate(`/orders`)
        } catch {
          toast.error('Payment verification failed. Contact support.')
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
          toast('Payment cancelled')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      toast.error('Payment failed. Please try again.')
      setLoading(false)
    })
    rzp.open()
  }

  // ── Submit order ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!items.length) { toast.error('Your cart is empty'); return }
    setLoading(true)

    try {
      const payload = {
        full_name:      `${form.first_name} ${form.last_name}`.trim(),
        email:          form.email,
        phone:          form.phone,
        address:        form.address,
        city:           form.city,
        state:          form.state,
        pincode:        form.pincode,
        payment_method: payMethod,
      }

      const { data } = await api.post('/orders/create/', payload)

      if (payMethod === 'cod') {
        clearCart()
        toast.success('Order placed! Cash on delivery.')
        navigate(`/orders`)
        return
      }

      // Open Razorpay modal
      await handleRazorpay(data)

    } catch (err) {
      toast.error(err?.response?.data?.error || 'Order failed. Please try again.')
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: 64 }}>🛒</div>
        <h4 className="fw-700 mt-3">Your cart is empty</h4>
        <button className="btn btn-yellow mt-3 px-5" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <Breadcrumb />
      <h3 className="fw-700 text-center mb-4">Checkout</h3>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* ── Left: Form ── */}
          <div className="col-12 col-lg-7">

            {/* Contact */}
            <h5 className="fw-700 mb-3">Contact</h5>
            <div className="mb-3">
              <input
                type="email" className="form-control" placeholder="Email (for order updates)"
                value={form.email} onChange={e => set('email', e.target.value)} required
              />
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="newsletter"
                checked={form.newsletter} onChange={e => set('newsletter', e.target.checked)} />
              <label className="form-check-label" htmlFor="newsletter" style={{ fontSize: 13 }}>
                Send me order updates, news and offers on Email and WhatsApp
              </label>
            </div>

            <hr />

            {/* Delivery address */}
            <h5 className="fw-700 mb-3">Delivery address</h5>

            <div className="mb-3">
              <input className="form-control" placeholder="Country/Region"
                value={form.country} onChange={e => set('country', e.target.value)} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <input className="form-control" placeholder="First name"
                  value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
              </div>
              <div className="col-6">
                <input className="form-control" placeholder="Last name"
                  value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
              </div>
            </div>
            <div className="mb-3">
              <input className="form-control" placeholder="Address"
                value={form.address} onChange={e => set('address', e.target.value)} required />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-4">
                <input className="form-control" placeholder="City"
                  value={form.city} onChange={e => set('city', e.target.value)} required />
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="State"
                  value={form.state} onChange={e => set('state', e.target.value)} required />
              </div>
              <div className="col-4">
                <input className="form-control" placeholder="Pincode" maxLength={6}
                  value={form.pincode} onChange={e => set('pincode', e.target.value)} required />
              </div>
            </div>
            <div className="mb-3">
              <input className="form-control" placeholder="Phone Number" maxLength={10}
                value={form.phone} onChange={e => set('phone', e.target.value)} required />
            </div>
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="saveInfo"
                checked={form.saveInfo} onChange={e => set('saveInfo', e.target.checked)} />
              <label className="form-check-label" htmlFor="saveInfo" style={{ fontSize: 13 }}>
                Save this information for next time
              </label>
            </div>

            <hr />

            {/* Payment method */}
            <h5 className="fw-700 mb-3">Choose your payment method</h5>

            <div
              className={`border rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between ${payMethod === 'razorpay' ? 'border-warning' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setPayMethod('razorpay')}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${payMethod === 'razorpay' ? 'var(--bz-yellow)' : '#ccc'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {payMethod === 'razorpay' && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bz-yellow)' }} />
                  )}
                </div>
                <span style={{ fontSize: 14 }}>Secure transaction (UPI, cards, wallets, net banking)</span>
              </div>
              {/* Payment icons */}
              <div className="d-flex gap-1 align-items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/120px-Google_Pay_Logo.svg.png" alt="GPay" style={{ height: 18 }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/120px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" style={{ height: 18 }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Visa_2021.svg/120px-Visa_2021.svg.png" alt="Visa" style={{ height: 14 }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="MC" style={{ height: 20 }} />
              </div>
            </div>

            <div
              className={`border rounded-3 p-3 d-flex align-items-center gap-3 ${payMethod === 'cod' ? 'border-warning' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setPayMethod('cod')}
            >
              <div
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${payMethod === 'cod' ? 'var(--bz-yellow)' : '#ccc'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {payMethod === 'cod' && (
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bz-yellow)' }} />
                )}
              </div>
              <span style={{ fontSize: 14 }}>Cash on delivery</span>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="col-12 col-lg-5">
            <div style={{ background: 'var(--bz-pink-light)', borderRadius: 16, padding: 24, position: 'sticky', top: 80 }}>
              <h5 className="fw-700 mb-4">Order Summary</h5>

              {/* Items */}
              {items.map((item, i) => (
                <div key={i} className="d-flex gap-3 mb-3">
                  <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', background: '#f0f0f0', flexShrink: 0 }}>
                    {item.product?.primary_image
                      ? <img src={item.product.primary_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: 28 }}>🍼</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="fw-600 mb-1" style={{ fontSize: 13, lineHeight: 1.3 }}>{item.product?.name}</p>
                    <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Qty: {item.quantity}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--bz-red)' }}>
                      ₹{Number(item.product?.mrp * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}

              {/* Discount code */}
              <div className="mb-3">
                <input className="form-control form-control-sm" placeholder="Discount code or gift card" />
              </div>

              <hr />

              {/* Price breakdown */}
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                <span>Sub total</span>
                <span className="fw-600">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                <span>Shipping</span>
                <span className="fw-600">{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && (
                <p style={{ fontSize: 12, color: '#888' }}>Flat rate: ₹99.00</p>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: 16, fontWeight: 700 }}>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: 12, color: '#888' }}>
                (includes ₹{gst} GST)
              </p>

              {/* Place order */}
              <button
                type="submit"
                className="btn btn-yellow w-100 py-2 mt-3 fw-700"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                  : payMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'
                }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

// Inline breadcrumb import (safe fallback)
function Breadcrumb() {
  return null // replaced by Layout's Breadcrumb
}