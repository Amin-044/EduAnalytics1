import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const SignupPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      const res = await axios.post(API + '/signup.php', { name, email, password })
      if (res.data.includes('Successful')) {
        alert('Account created. Please login.')
        navigate('/login')
      } else {
        setError(res.data)
      }
    } catch {
      setError('Signup failed. Please try again.')
    }
  }

  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-center mb-1">Education Analytics</h3>
        <p className="text-center text-muted mb-4">Create a new account</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>

        <small className="text-muted d-block text-center mt-3">
          New accounts get view-only access until an admin upgrades them
        </small>
        <p className="text-center mt-2 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
