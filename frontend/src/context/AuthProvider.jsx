import { useState } from 'react'
import axios from 'axios'
import { AuthContext } from './useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem('user')

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // calls the PHP login file and saves user + token in localStorage
  const login = async (credentials) => {
    const res = await axios.post(API + '/login.php', credentials)
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    localStorage.setItem('token', res.data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
