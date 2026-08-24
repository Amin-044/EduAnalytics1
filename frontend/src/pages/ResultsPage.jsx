import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { downloadResultPdf } from '../utils/resultPdf'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

const PASS_MARK = 40

// grade from average marks
const performanceStatus = (avg) => {
  if (avg >= 75) return 'Excellent'
  if (avg >= 60) return 'Good'
  if (avg >= 40) return 'Needs Improvement'
  return 'Poor'
}

const gradeVariant = {
  Excellent: 'success',
  Good: 'info',
  'Needs Improvement': 'warning',
  Poor: 'danger',
}

export const ResultsPage = () => {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [marks, setMarks] = useState([])
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    axios.get(API + '/getStudents.php').then((res) => setStudents(res.data))
    axios.get(API + '/getSubjects.php').then((res) => setSubjects(res.data))
    axios.get(API + '/getMarks.php').then((res) => setMarks(res.data))
  }, [])

  // build one result sheet per student
  const allResults = students.map((student) => {
    const rows = marks
      .filter((m) => m.student_id == student.id)
      .map((m) => {
        const subject = subjects.find((s) => s.id == m.subject_id)
        const avg = (Number(m.internal_1) + Number(m.internal_2) + Number(m.assignment)) / 3
        return {
          ...m,
          subjectCode: subject?.code ?? `#${m.subject_id}`,
          subjectName: subject?.name ?? `#${m.subject_id}`,
          avg,
          grade: performanceStatus(avg),
          passed: avg >= PASS_MARK,
        }
      })
    const overall = rows.length
      ? rows.reduce((sum, r) => sum + r.avg, 0) / rows.length
      : null
    return {
      student,
      rows,
      overall,
      grade: overall !== null ? performanceStatus(overall) : 'N/A',
      result: rows.length ? (rows.every((r) => r.passed) ? 'PASS' : 'FAIL') : 'N/A',
    }
  })

  const visible = selectedId
    ? allResults.filter((r) => String(r.student.id) === selectedId)
    : allResults

  const marked = allResults.filter((r) => r.overall !== null)
  const classAverage = marked.length
    ? marked.reduce((sum, r) => sum + r.overall, 0) / marked.length
    : 0
  const passedCount = marked.filter((r) => r.result === 'PASS').length
  const failedCount = marked.length - passedCount

  const handleDownloadAll = () => {
    downloadResultPdf(
      visible,
      selectedId ? `Result-${visible[0].student.student_id}.pdf` : `Result-Sheets-All-${new Date().getFullYear()}.pdf`,
    )
  }

  const handleDownloadStudent = (entry) => {
    downloadResultPdf([entry], `Result-${entry.student.student_id}.pdf`)
  }

  const single = visible.length === 1 ? visible[0] : null

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Results</h2>
        <button className="btn btn-primary" onClick={handleDownloadAll}>
          ⬇ Download {selectedId && single ? `${single.student.name}'s ` : ''}Result (PDF)
        </button>
      </div>

      <div style={{ maxWidth: 360 }} className="mb-4">
        <label className="form-label">Select Student</label>
        <select
          className="form-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">All Students</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.student_id} — {s.name}</option>
          ))}
        </select>
      </div>

      {!single && (
        <div className="row g-3 mb-4">
          <StatCard title="Students With Marks" value={marked.length} color="primary" />
          <StatCard title="Passed" value={passedCount} color="success" />
          <StatCard title="Failed" value={failedCount} color="danger" />
          <StatCard title="Class Average" value={classAverage.toFixed(2)} color="info" />
        </div>
      )}

      {single && (
        <div className="row g-3 mb-4">
          <StatCard title="Overall Average" value={single.overall !== null ? single.overall.toFixed(2) : 'N/A'} color="primary" />
          <StatCard title="Performance" value={single.grade} color={gradeVariant[single.grade] === 'danger' ? 'danger' : gradeVariant[single.grade] === 'warning' ? 'warning' : 'success'} />
          <StatCard title="Subjects" value={single.rows.length} color="info" />
          <StatCard title="Final Result" value={single.result} color={single.result === 'PASS' ? 'success' : single.result === 'FAIL' ? 'danger' : 'secondary'} />
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">
          {single ? `Subject-wise Result — ${single.student.name}` : 'Overall Summary'}
        </div>
        <div className="card-body p-0">
          {single ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>Subject Code</th><th>Subject</th><th>Internal 1</th><th>Internal 2</th>
                    <th>Assignment</th><th>Average</th><th>Grade</th><th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {single.rows.length === 0 ? (
                    <tr><td colSpan="8" className="text-center text-muted py-4">No marks available for this student.</td></tr>
                  ) : (
                    single.rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.subjectCode}</td>
                        <td>{r.subjectName}</td>
                        <td>{Number(r.internal_1)}</td>
                        <td>{Number(r.internal_2)}</td>
                        <td>{Number(r.assignment)}</td>
                        <td>{r.avg.toFixed(2)}</td>
                        <td><span className={`badge bg-${gradeVariant[r.grade]}`}>{r.grade}</span></td>
                        <td><span className={`badge bg-${r.passed ? 'success' : 'danger'}`}>{r.passed ? 'Pass' : 'Fail'}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>Student ID</th><th>Name</th><th>Course</th><th>Semester</th>
                    <th>Subjects</th><th>Overall Average</th><th>Grade</th><th>Final Result</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((entry) => (
                    <tr key={entry.student.id}>
                      <td>{entry.student.student_id}</td>
                      <td>{entry.student.name}</td>
                      <td>{entry.student.course}</td>
                      <td>{entry.student.semester}</td>
                      <td>{entry.rows.length || '-'}</td>
                      <td>{entry.overall !== null ? entry.overall.toFixed(2) : 'N/A'}</td>
                      <td>{entry.grade === 'N/A' ? <span className="text-muted">N/A</span> : <span className={`badge bg-${gradeVariant[entry.grade]}`}>{entry.grade}</span>}</td>
                      <td>
                        {entry.result === 'N/A'
                          ? <span className="text-muted">N/A</span>
                          : <span className={`badge bg-${entry.result === 'PASS' ? 'success' : 'danger'}`}>{entry.result}</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          disabled={!entry.rows.length}
                          onClick={() => handleDownloadStudent(entry)}
                        >
                          ⬇ Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <p className="text-muted small mt-2 mb-0">
        Passing criteria: minimum average of {PASS_MARK} per subject. Final result is PASS only if all subjects are passed.
      </p>
    </DashboardLayout>
  )
}
