import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'

export const DashboardLayout = ({ children }) => (
  <div>
    <Navbar />

    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  </div>
)
