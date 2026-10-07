import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/useAuth'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid
} from 'recharts'

const API = import.meta.env.VITE_API_URL || 'http://localhost/EduAnalytics/backend/api'

export const DashboardPage = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    axios.get(API + '/getDashboard.php').then((res) => {
      setAnalytics(res.data)
    })
  }, [])

  if (!analytics) {
    return <DashboardLayout><p>Loading dashboard...</p></DashboardLayout>
  }

  const pieColors = ['#10b981', '#f43f5e']

  return (
    <DashboardLayout>
      <h2 className="mb-1">Dashboard</h2>
      <p className="text-muted">Welcome back, {user?.name}</p>

      <div className="row g-3 mb-4">
        <StatCard title="Total Students" value={analytics.totalStudents} color="primary" />
        <StatCard title="Total Subjects" value={analytics.totalSubjects} color="success" />
        <StatCard title="Average Marks" value={analytics.averageMarks} suffix="%" color="info" />
        <StatCard title="Avg Attendance" value={analytics.averageAttendance} suffix="%" color="warning" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-white">Subject Average Marks</div>
            <div className="card-body">
              {analytics.subjectAverages.length === 0 ? (
                <p className="text-muted text-center my-5">No marks available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.subjectAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#6366f1" name="Avg Marks" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-white">Attendance Distribution</div>
            <div className="card-body d-flex align-items-center">
              {analytics.attendanceDist.good + analytics.attendanceDist.low === 0 ? (
                <p className="text-muted text-center w-100 my-5">No attendance records available.</p>
              ) : (
                <>
                  <ResponsiveContainer width="60%" height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Good', value: analytics.attendanceDist.good },
                          { name: 'Low', value: analytics.attendanceDist.low },
                        ]}
                        dataKey="value"
                        outerRadius={90}
                        label
                      >
                        <Cell fill={pieColors[0]} />
                        <Cell fill={pieColors[1]} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="list-unstyled mb-0">
                    <li><span className="badge bg-success me-2">&nbsp;</span>Good (&ge;75%): {analytics.attendanceDist.good}</li>
                    <li className="mt-2"><span className="badge bg-danger me-2">&nbsp;</span>Low (&lt;75%): {analytics.attendanceDist.low}</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-white">Overall Performance (student average marks)</div>
        <div className="card-body">
          {analytics.studentAverages.length === 0 ? (
            <p className="text-muted text-center my-5">No students found.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.studentAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#7c3aed" name="Avg Marks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
