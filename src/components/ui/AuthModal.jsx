import { useState } from 'react'
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useAuthStore } from '../../store'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import babyimg from '../../assets/forum8.webp'
import babyimg1 from '../../assets/about.jpg'

export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data } = await api.post('/users/login/', { email: form.email, password: form.password })
        login(data.user, { access: data.access, refresh: data.refresh })
        toast.success(`Welcome back, ${data.user.username}!`)
        onClose()
      } else {
        const { data } = await api.post('/users/register/', {
          username: form.username,
          email: form.email,
          password: form.password,
        })
        login(data.user || data, data.token || { access: data.access, refresh: data.refresh })
        toast.success('Account created! Welcome to BabyZone 🍼')
        onClose()
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal position-relative" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className="auth-modal close-btn" onClick={onClose}>
          <FiX size={16} />
        </button>

        {/* Left image — matches screenshots */}
        <img
          className="auth-img"
          src={mode === 'login'
            ? babyimg   // sleeping baby with teddy
            : babyimg1  // mom and baby
          }
          alt=""
        />

        {/* Right form */}
        <div className="auth-form">
          <h4>{mode === 'login' ? 'Log In' : 'Register'}</h4>

          <form onSubmit={handleSubmit}>
            {/* Name — register only */}
            {mode === 'register' && (
              <input
                className="form-control mb-3"
                placeholder="Your name"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            )}

            {/* Email */}
            <input
              className="form-control mb-3"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            {/* Password */}
            <div className="position-relative mb-2">
              <input
                className="form-control pe-5"
                placeholder="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0 pe-3"
              >
                {showPass ? <FiEyeOff size={16} color="#888" /> : <FiEye size={16} color="#888" />}
              </button>
            </div>

            {/* Forgot password — login only */}
            {mode === 'login' && (
              <div className="text-end mb-3">
                <button type="button" className="btn btn-link p-0 text-danger" style={{ fontSize: 12 }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn btn-yellow w-100 mb-3 fw-700">
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Register'}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center mb-3" style={{ fontSize: 13 }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="btn btn-link text-danger p-0 ms-1 fw-700"
              style={{ fontSize: 13 }}
            >
              {mode === 'login' ? 'Register' : 'Log In'}
            </button>
          </p>

          <p className="text-center text-muted mb-2" style={{ fontSize: 12 }}>Or</p>

          <button className="social-btn mb-2">
            <FaGoogle color="#EA4335" size={16} /> Continue with Google
          </button>
          <button className="social-btn">
            <FaFacebook color="#1877F2" size={16} /> Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  )
}