import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

// grade labels from average marks
const performanceStatus = (avg) => {
  if (avg >= 75) return 'Excellent'
  if (avg >= 60) return 'Good'
  if (avg >= 40) return 'Needs Improvement'
  return 'Poor'
}

const attendanceStatus = (pct) => (pct >= 75 ? 'Good' : 'Low')

export const StudentAnalyticsPage = () => {
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    axios.get(API + '/getStudents.php').then((res) => {
      setStudents(res.data)
      if (res.data.length > 0) {
        setSelectedId(res.data[0].id)
      }
    })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    axios.get(API + '/getStudentAnalytics.php?id=' + selectedId).then((res) => {
      setAnalytics(res.data)
    })
  }, [selectedId])

  if (!analytics) {
    return (
      <DashboardLayout>
        <h2 className="mb-3">Student Analytics</h2>
        <p className="text-muted">Select a student to view analytics.</p>
      </DashboardLayout>
    )
  }

  const student = analytics.student
  const subjectRows = analytics.subjects

  // chart data: one bar per subject that has marks
  const chartData = subjectRows
    .filter((r) => r.marks !== null)
    .map((r) => ({ subject: r.code, marks: r.marks }))

  return (
    <DashboardLayout>
      <h2 className="mb-3">Student Analytics</h2>

      <div style={{ maxWidth: '360px' }} className="mb-4">
        <label className="form-label">Select Student</label>
        <select
          className="form-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.student_id} — {s.name}</option>
          ))}
        </select>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">{student.name} <span className="text-muted">({student.student_id})</span></h5>
          <div className="row text-center g-3">
            <div className="col-md-3 col-6">
              <p className="text-muted mb-1 small">Average Marks</p>
              <h4 className="fw-bold">{analytics.averageMarks.toFixed(2)}%</h4>
            </div>
            <div className="col-md-3 col-6">
              <p className="text-muted mb-1 small">Performance</p>
              <span className={`badge fs-6 ${analytics.averageMarks >= 60 ? 'bg-success' : analytics.averageMarks >= 40 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                {performanceStatus(analytics.averageMarks)}
              </span>
            </div>
            <div className="col-md-3 col-6">
              <p className="text-muted mb-1 small">Average Attendance</p>
              <h4 className="fw-bold">{analytics.averageAttendance.toFixed(2)}%</h4>
            </div>
            <div className="col-md-3 col-6">
              <p className="text-muted mb-1 small">Attendance Status</p>
              <span className={`badge fs-6 ${analytics.averageAttendance >= 75 ? 'bg-success' : 'bg-danger'}`}>
                {attendanceStatus(analytics.averageAttendance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">Subject Performance (marks %)</div>
        <div className="card-body">
          {chartData.length === 0 ? (
            <p className="text-muted text-center my-5">No marks available for this student.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#0d6efd" name="Marks %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white">Subject Details</div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr><th>Code</th><th>Subject</th><th>Marks</th><th>Marks Status</th><th>Attendance</th><th>Attendance Status</th></tr>
            </thead>
            <tbody>
              {subjectRows.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-4">No subjects found.</td></tr>
              ) : (
                subjectRows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.code}</td>
                    <td>{r.name}</td>
                    <td>{r.marks === null ? '—' : `${r.marks.toFixed(2)}%`}</td>
                    <td>{r.marks === null ? '—' : performanceStatus(r.marks)}</td>
                    <td>{r.attendance === null ? '—' : `${r.attendance.toFixed(2)}%`}</td>
                    <td>{r.attendance === null ? '—' : attendanceStatus(r.attendance)}</td>
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
