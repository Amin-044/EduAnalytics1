import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const SubjectsPage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [subjects, setSubjects] = useState([])
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', code: '' })

  const loadSubjects = () => {
    axios.get(API + '/getSubjects.php').then((res) => {
      setSubjects(res.data)
    })
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const filtered = subjects.filter((s) => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  })

  const openAddModal = () => {
    setEditingId(null)
    setFormData({ name: '', code: '' })
    setModalVisible(true)
  }

  const openEditModal = (subject) => {
    setEditingId(subject.id)
    setFormData({ name: subject.name, code: subject.code })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this subject? Related marks and attendance will also be removed.')) {
      await axios.post(API + '/deleteSubject.php', { id: id })
      loadSubjects()
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.post(API + '/updateSubject.php', { id: editingId, ...formData })
    } else {
      await axios.post(API + '/insertSubject.php', formData)
    }
    setModalVisible(false)
    loadSubjects()
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Subjects</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '240px' }}
          />
          {isAdmin && <button className="btn btn-success" onClick={openAddModal}>+ Add Subject</button>}
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr><th>Code</th><th>Subject</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="3" className="text-center text-muted py-4">No subjects found.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.code}</td>
                    <td>{s.name}</td>
                    <td>
                      {isAdmin ? (
                        <>
                          <button className="btn btn-outline-primary btn-sm me-1" onClick={() => openEditModal(s)}>Edit</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                        </>
                      ) : (
                        <span className="text-muted">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalVisible && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSave}>
                  <div className="modal-header">
                    <h5 className="modal-title">{editingId ? 'Edit Subject' : 'Add Subject'}</h5>
                    <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Subject Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Database Management System"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="BCA601"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Save'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
