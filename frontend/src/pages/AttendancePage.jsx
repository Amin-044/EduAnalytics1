import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const AttendancePage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    student_id: '', subject_id: '', total_classes: '', present_classes: ''
  })
  const [error, setError] = useState('')

  // live percentage preview for the form
  const livePct = formData.total_classes > 0
    ? (Number(formData.present_classes) / Number(formData.total_classes)) * 100
    : 0

  const loadAll = () => {
    axios.get(API + '/getStudents.php').then((res) => setStudents(res.data))
    axios.get(API + '/getSubjects.php').then((res) => setSubjects(res.data))
    axios.get(API + '/getAttendance.php').then((res) => setAttendance(res.data))
  }

  useEffect(() => {
    loadAll()
  }, [])

  const openAddForm = () => {
    setEditingId(null)
    setFormData({ student_id: '', subject_id: '', total_classes: '', present_classes: '' })
    setError('')
    setFormVisible(true)
  }

  const openEditForm = (record) => {
    setEditingId(record.id)
    setFormData({
      student_id: String(record.student_id),
      subject_id: String(record.subject_id),
      total_classes: String(record.total_classes),
      present_classes: String(record.present_classes),
    })
    setError('')
    setFormVisible(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this attendance record?')) {
      await axios.post(API + '/deleteAttendance.php', { id: id })
      loadAll()
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const total = Number(formData.total_classes)
    const present = Number(formData.present_classes)

    if (!formData.student_id || !formData.subject_id) {
      setError('Please select a student and a subject.')
      return
    }
    if (isNaN(total) || total < 0 || isNaN(present) || present < 0) {
      setError('Total and Present classes must be integers of at least 0.')
      return
    }
    if (present > total) {
      setError('Present classes cannot be greater than total classes.')
      return
    }

    if (editingId) {
      await axios.post(API + '/updateAttendance.php', {
        id: editingId,
        student_id: formData.student_id,
        subject_id: formData.subject_id,
        total_classes: total,
        present_classes: present,
      })
    } else {
      await axios.post(API + '/insertAttendance.php', {
        student_id: formData.student_id,
        subject_id: formData.subject_id,
        total_classes: total,
        present_classes: present,
      })
    }
    setFormVisible(false)
    loadAll()
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Attendance Management</h2>
        {isAdmin && <button className="btn btn-primary" onClick={openAddForm}>+ Enter Attendance</button>}
      </div>

      {formVisible && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">{editingId ? 'Update Attendance' : 'Enter Attendance'}</div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.student_id} — {s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Total Classes</label>
                  <input
                    type="number" min="0"
                    className="form-control"
                    value={formData.total_classes}
                    onChange={(e) => setFormData({ ...formData, total_classes: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Present Classes</label>
                  <input
                    type="number" min="0"
                    className="form-control"
                    value={formData.present_classes}
                    onChange={(e) => setFormData({ ...formData, present_classes: e.target.value })}
                    required
                  />
                </div>
              </div>

              <p className="mt-3 mb-0">
                Percentage: <strong>{livePct.toFixed(2)}%</strong>
                {' '}<span className="text-muted">= Present / Total × 100 (0% if total is 0)</span>
              </p>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setFormVisible(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">{editingId ? 'Update Attendance' : 'Save Attendance'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>Student</th><th>Subject</th><th>Total</th><th>Present</th><th>%</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-4">No attendance records available.</td></tr>
              ) : (
                attendance.map((a) => {
                  const pct = a.total_classes > 0 ? (a.present_classes / a.total_classes) * 100 : 0
                  return (
                    <tr key={a.id}>
                      <td>{a.student_name}</td>
                      <td>{a.subject_code}</td>
                      <td>{a.total_classes}</td>
                      <td>{a.present_classes}</td>
                      <td>{pct.toFixed(2)}%</td>
                      <td>
                        <span className={`badge ${pct >= 75 ? 'bg-success' : 'bg-danger'}`}>
                          {pct >= 75 ? 'Good' : 'Low'}
                        </span>
                      </td>
                      <td>
                        {isAdmin ? (
                          <>
                            <button className="btn btn-outline-primary btn-sm me-1" onClick={() => openEditForm(a)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button>
                          </>
                        ) : (
                          <span className="text-muted">View only</span>
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
    </DashboardLayout>
  )
}
