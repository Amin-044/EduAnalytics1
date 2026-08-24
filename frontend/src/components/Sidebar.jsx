import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export const Sidebar = () => {
  const { user } = useAuth()

  return (
    <nav className="sidebar">
      <h5 className="text-center mb-4 text-primary">Menu</h5>

      <ul className="nav flex-column gap-1">
        <li className="nav-item">
          <NavLink to="/dashboard" end className="nav-link">📊 Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/students" className="nav-link">👥 Students</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/subjects" className="nav-link">📚 Subjects</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/marks" className="nav-link">📝 Marks</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/attendance" className="nav-link">🗓 Attendance</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/results" className="nav-link">🧾 Results</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/student-analytics" className="nav-link">📈 Analytics</NavLink>
        </li>
        {user?.role === 'admin' && (
          <li className="nav-item">
            <NavLink to="/users" className="nav-link">👤 Users</NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}
