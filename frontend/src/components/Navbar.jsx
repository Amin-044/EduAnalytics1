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
      <div className="container-fluid px-4">
        <Link to="/dashboard" className="navbar-brand">
          <span className="fw-bold text-primary">Education</span> Analytics
        </Link>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Hi, {user?.name || 'Guest'}</span>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
