import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const UsersPage = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])

  const loadUsers = () => {
    axios.get(API + '/getUsers.php').then((res) => {
      setUsers(res.data)
    })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    await axios.post(API + '/updateUserRole.php', { id: u.id, role: newRole })
    loadUsers()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this user account?')) {
      await axios.post(API + '/deleteUser.php', { id: id })
      loadUsers()
    }
  }

  return (
    <DashboardLayout>
      <h2 className="mb-3">Users</h2>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted py-4">No users found.</td></tr>
              ) : (
                users.map((u) => {
                  const isSelf = Number(u.id) === Number(user?.id)
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name} {isSelf && <span className="text-muted">(you)</span>}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {isSelf ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <>
                            <button className="btn btn-outline-warning btn-sm me-1" onClick={() => handleRoleChange(u)}>
                              {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-muted small mt-2 mb-0">
        You cannot change your own role or delete your own account. New signups start as users.
      </p>
    </DashboardLayout>
  )
}
