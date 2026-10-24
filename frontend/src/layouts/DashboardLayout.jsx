import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'

export const DashboardLayout = ({ children }) => (
  <div className="dashboard-wrapper">
    <header className="header-stack sticky-top">
      <Navbar />
      <Sidebar />
    </header>

    <div className="dashboard-layout">
      <main className="main-content">{children}</main>
    </div>
  </div>
)
