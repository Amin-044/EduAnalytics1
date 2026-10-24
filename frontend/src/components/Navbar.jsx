import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid px-3 px-md-4">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
          <span className="brand-logo-badge">🎓</span>
          <span className="brand-text">
            <span className="fw-bold text-primary">Education</span> Analytics
          </span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <div className="user-profile-badge d-flex align-items-center gap-2">
            <span className="user-avatar-circle">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </span>
            <div className="d-none d-sm-block text-start lh-sm">
              <div className="fw-semibold text-dark small">{user?.name || 'Guest'}</div>
              {user?.role && (
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle role-pill">
                  {user.role}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
