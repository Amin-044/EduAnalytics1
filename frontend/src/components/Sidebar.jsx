import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export const Sidebar = () => {
  const { user } = useAuth()

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
    { to: '/students', label: 'Students', icon: '👥' },
    { to: '/subjects', label: 'Subjects', icon: '📚' },
    { to: '/marks', label: 'Marks', icon: '📝' },
    { to: '/attendance', label: 'Attendance', icon: '🗓' },
    { to: '/results', label: 'Results', icon: '🧾' },
    { to: '/student-analytics', label: 'Analytics', icon: '📈' },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'Users', icon: '👤' }] : []),
  ]

  return (
    <nav className="horizontal-menu-bar sidebar" aria-label="Main Navigation">
      <div className="container-fluid px-3 px-md-4">
        <ul className="horizontal-menu-nav">
          {navItems.map((item) => (
            <li key={item.to} className="nav-item">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export { Sidebar as HorizontalMenuBar }

