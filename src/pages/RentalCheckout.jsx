import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store'
import Breadcrumb from '../components/ui/Breadcrumb'
import api from '../utils/api'
import toast from 'react-hot-toast'

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src    = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function RentalCheckout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { user }  = useAuthStore()
  const [loading, setLoading]             = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [form, setForm] = useState({
    email:     user?.email    || '',
    full_name: user?.username || '',
    phone: '', address: '', city: '', state: '', pincode: '',
  })
  const [dateRange, setDateRange] = useState({ from: '01/09/2025', to: '30/09/2025' })

  const handleRazorpay = async (orderData) => {
    const loaded = await loadRazorpay()
    if (!loaded) { toast.error('Razorpay failed to load.'); setLoading(false); return }
    const options = {
      key:         orderData.key,
      amount:      orderData.amount,
      currency:    orderData.currency || 'INR',
      name:        'BabyZone Rentals',
      description: `Rental: ${state?.product?.name || 'Product'}`,
      order_id:    orderData.razorpay_order_id,
      prefill:     { name: form.full_name, email: form.email, contact: form.phone },
      theme:       { color: '#FFD83B' },
      handler: async (response) => {
        try {
          await api.post('/rental/verify-payment/', {
            order_id:            orderData.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
          })
          toast.success('Rental booking confirmed! 🎉')
          setLoading(false)
          navigate('/orders')
        } catch {
          toast.error('Payment verification failed. Contact support.')
          setLoading(false)
        }
      },
      modal: { ondismiss: () => { setLoading(false); toast('Payment cancelled') } }
    }
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => { toast.error('Payment failed.'); setLoading(false) })
    rzp.open()
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const today   = new Date()
      const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      const { data } = await api.post('/rental/create/', {
        ...form,
        payment_method: paymentMethod,
        product_id:     state?.product?.id  || 1,
        period:         state?.period       || 'Monthly',
        days:           30,
        price_per_day:  state?.product?.mrp || 199,
        start_date:     today.toISOString().split('T')[0],
        end_date:       endDate.toISOString().split('T')[0],
      })
      if (paymentMethod === 'cod') {
        toast.success('Rental booking confirmed! 🎉')
        setLoading(false)
        navigate('/orders')
        return
      }
      await handleRazorpay(data)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Booking failed. Please try again.')
      setLoading(false)
    }
  }

  const f = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) })

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Rental services', to: '/rental-services' },
        { label: 'Checkout' }
      ]} />
      <h2 className="fw-700 text-center mb-4">Checkout</h2>
      <form onSubmit={handleOrder}>
        <div className="row g-4">
          <div className="col-12 col-md-7 checkout-form">
            <h5 className="fw-700 mb-3">Contact</h5>
            <input className="form-control mb-3" placeholder="Email" type="email" {...f('email')} required />
            <h5 className="fw-700 mb-3">Delivery address</h5>
            <select className="form-control mb-3"><option>India</option></select>
            <div className="row g-2 mb-2">
              <div className="col-6"><input className="form-control" placeholder="First name" {...f('full_name')} required /></div>
              <div className="col-6"><input className="form-control" placeholder="Last name" /></div>
            </div>
            <input className="form-control mb-2" placeholder="Address" required {...f('address')} />
            <div className="row g-2 mb-2">
              <div className="col-4"><input className="form-control" placeholder="City"    required {...f('city')} /></div>
              <div className="col-4"><input className="form-control" placeholder="State"   required {...f('state')} /></div>
              <div className="col-4"><input className="form-control" placeholder="Pincode" required {...f('pincode')} /></div>
            </div>
            <input className="form-control mb-4" placeholder="Phone Number" required {...f('phone')} />

            <h5 className="fw-700 mb-3">Payment method</h5>
            <div className={`payment-option mb-2 ${paymentMethod === 'razorpay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('razorpay')}>
              <div className="d-flex align-items-center gap-3">
                <input type="radio" name="rpayment" checked={paymentMethod === 'razorpay'} readOnly />
                <span className="fw-600" style={{ fontSize: 14 }}>Secure transaction (UPI, cards, wallets, net banking)</span>
              </div>
            </div>
            <div className={`payment-option mb-4 ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
              <div className="d-flex align-items-center gap-3">
                <input type="radio" name="rpayment" checked={paymentMethod === 'cod'} readOnly />
                <span className="fw-600" style={{ fontSize: 14 }}>Cash on delivery</span>
              </div>
            </div>

            <h5 className="fw-700 mb-3">Return Status</h5>
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className="fw-600" style={{ fontSize: 14 }}>From</span>
              <input type="text" className="form-control" value={dateRange.from}
                onChange={e => setDateRange({ ...dateRange, from: e.target.value })} style={{ maxWidth: 140 }} />
              <span className="fw-600">To</span>
              <input type="text" className="form-control" value={dateRange.to}
                onChange={e => setDateRange({ ...dateRange, to: e.target.value })} style={{ maxWidth: 140 }} />
            </div>
            <p style={{ fontSize: 12, color: '#888' }}>At {dateRange.to}, our staff will contact you to return the product</p>
          </div>

          <div className="col-12 col-md-5">
            <div className="order-summary-card">
              <h5 className="fw-700 mb-3">Order Summary</h5>
              <div className="d-flex gap-3 mb-3">
                <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', background: 'white', flexShrink: 0 }}>
                  {state?.product?.primary_image
                    ? <img src={state.product.primary_image} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    : <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: 28 }}>🍼</div>
                  }
                </div>
                <div style={{ fontSize: 13 }}>
                  <p className="fw-700 mb-1">{state?.product?.name || 'Rental Product'}</p>
                  <p className="mb-0 text-muted">Price: ₹{state?.product?.mrp || 199}</p>
                  <p className="mb-0 text-muted">Period: {state?.period || 'Monthly'} (30 days)</p>
                </div>
              </div>
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                  <span>Sub total</span><span className="fw-700">₹{state?.product?.mrp || 199}</span>
                </div>
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#888' }}>
                  <span>GST:</span><span>₹50.00</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <span className="fw-700">Total</span>
                  <span className="fw-700">₹{(state?.product?.mrp || 199) + 50}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-yellow w-100 py-2 fw-700 mt-2">
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                  : paymentMethod === 'cod' ? 'Book Now (COD)' : 'Pay & Book Now'
                }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}