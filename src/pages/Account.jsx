import { Link } from 'react-router-dom'
import { useAuthStore } from '../store'
import Breadcrumb from '../components/ui/Breadcrumb'
import { FiLogOut, FiMessageCircle, FiPackage } from 'react-icons/fi'

export default function Account() {
  const { user, logout } = useAuthStore()

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
      <h2 className="fw-700 mb-4">My Account</h2>

      <div className="border rounded-3 p-4 mb-3">
        {/* User avatar + info */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--bz-pink)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28, fontWeight: 700
          }}>
            {user?.username?.[0]?.toUpperCase() || '👤'}
          </div>
          <div>
            <p className="fw-700 mb-0" style={{ fontSize: 18 }}>{user?.username || 'User'}</p>
            <p className="text-muted mb-0">{user?.email}</p>
            {user?.phone && <p className="text-muted mb-0">{user.phone}</p>}
          </div>
        </div>

        {/* Quick links */}
        <div className="row g-3">
          <div className="col-6">
            <Link
              to="/orders"
              className="d-flex align-items-center gap-2 border rounded-3 p-3 text-decoration-none text-dark"
            >
              <FiPackage size={20} color="var(--bz-red)" />
              <span className="fw-600">My Orders</span>
            </Link>
          </div>
          <div className="col-6">
            <Link
              to="/forum"
              className="d-flex align-items-center gap-2 border rounded-3 p-3 text-decoration-none text-dark"
            >
              <FiMessageCircle size={20} color="var(--bz-red)" />
              <span className="fw-600">Forum</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ logout is async — must be awaited */}
      <button
        onClick={async () => await logout()}
        className="btn btn-outline-danger w-100 py-2 fw-700 d-flex align-items-center justify-content-center gap-2"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  )
}