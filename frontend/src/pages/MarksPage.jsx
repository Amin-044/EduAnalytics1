import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const MarksPage = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [marks, setMarks] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    student_id: '', subject_id: '', internal_1: '', internal_2: '', assignment: ''
  })
  const [error, setError] = useState('')

  // live average preview for the form
  const average = (
    (Number(formData.internal_1) || 0) +
    (Number(formData.internal_2) || 0) +
    (Number(formData.assignment) || 0)
  ) / 3

  const loadAll = () => {
    axios.get(API + '/getStudents.php').then((res) => setStudents(res.data))
    axios.get(API + '/getSubjects.php').then((res) => setSubjects(res.data))
    axios.get(API + '/getMarks.php').then((res) => setMarks(res.data))
  }

  useEffect(() => {
    loadAll()
  }, [])

  const openAddForm = () => {
    setEditingId(null)
    setFormData({ student_id: '', subject_id: '', internal_1: '', internal_2: '', assignment: '' })
    setError('')
    setFormVisible(true)
  }

  const openEditForm = (mark) => {
    setEditingId(mark.id)
    setFormData({
      student_id: String(mark.student_id),
      subject_id: String(mark.subject_id),
      internal_1: String(Number(mark.internal_1)),
      internal_2: String(Number(mark.internal_2)),
      assignment: String(Number(mark.assignment)),
    })
    setError('')
    setFormVisible(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this marks record?')) {
      await axios.post(API + '/deleteMark.php', { id: id })
      loadAll()
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const i1 = Number(formData.internal_1)
    const i2 = Number(formData.internal_2)
    const asg = Number(formData.assignment)

    if (!formData.student_id || !formData.subject_id) {
      setError('Please select a student and a subject.')
      return
    }
    if ([i1, i2, asg].some((v) => isNaN(v) || v < 0 || v > 100)) {
      setError('Internal 1, Internal 2 and Assignment must be numbers between 0 and 100.')
      return
    }

    if (editingId) {
      await axios.post(API + '/updateMark.php', {
        id: editingId,
        student_id: formData.student_id,
        subject_id: formData.subject_id,
        internal_1: i1,
        internal_2: i2,
        assignment: asg,
      })
    } else {
      await axios.post(API + '/insertMark.php', {
        student_id: formData.student_id,
        subject_id: formData.subject_id,
        internal_1: i1,
        internal_2: i2,
        assignment: asg,
      })
    }
    setFormVisible(false)
    loadAll()
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Marks Management</h2>
        {isAdmin && <button className="btn btn-primary" onClick={openAddForm}>+ Enter Marks</button>}
      </div>

      {formVisible && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">{editingId ? 'Update Marks' : 'Enter Marks'}</div>
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
                <div className="col-md-4">
                  <label className="form-label">Internal 1 (0-100)</label>
                  <input
                    type="number" min="0" max="100"
                    className="form-control"
                    value={formData.internal_1}
                    onChange={(e) => setFormData({ ...formData, internal_1: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Internal 2 (0-100)</label>
                  <input
                    type="number" min="0" max="100"
                    className="form-control"
                    value={formData.internal_2}
                    onChange={(e) => setFormData({ ...formData, internal_2: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Assignment (0-100)</label>
                  <input
                    type="number" min="0" max="100"
                    className="form-control"
                    value={formData.assignment}
                    onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                    required
                  />
                </div>
              </div>

              <p className="mt-3 mb-0">
                Average: <strong>{average.toFixed(2)}</strong>
                {' '}<span className="text-muted">= (I1 + I2 + Assignment) / 3</span>
              </p>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setFormVisible(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">{editingId ? 'Update Marks' : 'Save Marks'}</button>
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
                <th>Student</th><th>Subject</th><th>Internal 1</th><th>Internal 2</th>
                <th>Assignment</th><th>Average</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-4">No marks available.</td></tr>
              ) : (
                marks.map((m) => (
                  <tr key={m.id}>
                    <td>{m.student_name}</td>
                    <td>{m.subject_code}</td>
                    <td>{Number(m.internal_1)}</td>
                    <td>{Number(m.internal_2)}</td>
                    <td>{Number(m.assignment)}</td>
                    <td>{((Number(m.internal_1) + Number(m.internal_2) + Number(m.assignment)) / 3).toFixed(2)}</td>
                    <td>
                      {isAdmin ? (
                        <>
                          <button className="btn btn-outline-primary btn-sm me-1" onClick={() => openEditForm(m)}>Edit</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
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
    </DashboardLayout>
  )
}
