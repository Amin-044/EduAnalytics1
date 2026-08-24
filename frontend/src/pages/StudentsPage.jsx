import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

const emptyForm = { student_id: '', name: '', email: '', phone: '', course: 'BCA', semester: '' }

export const StudentsPage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  // load the student list from the PHP backend
  const loadStudents = () => {
    axios.get(API + '/getStudents.php').then((res) => {
      setStudents(res.data)
    })
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.student_id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    )
  })

  const openAddModal = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setModalVisible(true)
  }

  const openEditModal = (student) => {
    setEditingId(student.id)
    setFormData({
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      semester: String(student.semester),
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this student? Related marks and attendance will also be removed.')) {
      await axios.post(API + '/deleteStudent.php', { id: id })
      loadStudents()
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.post(API + '/updateStudent.php', { id: editingId, ...formData })
    } else {
      await axios.post(API + '/insertStudent.php', formData)
    }
    setModalVisible(false)
    loadStudents()
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Students</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '240px' }}
          />
          {isAdmin && <button className="btn btn-primary" onClick={openAddModal}>+ Add Student</button>}
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Semester</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No students found.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>{s.semester}</td>
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
                    <h5 className="modal-title">{editingId ? 'Edit Student' : 'Add Student'}</h5>
                    <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Student ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="BCA001"
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone (optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Semester</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max="8"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
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
