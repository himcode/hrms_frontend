import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { fetchEmployeeAttendance } from '../api/employees'

export default function EmployeeAttendancePage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    const params = {}
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    fetchEmployeeAttendance(id, params)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id, dateFrom, dateTo])

  if (loading) return <PageLayout title="Employee Attendance"><Spinner size="lg" /></PageLayout>
  if (error) return <PageLayout title="Employee Attendance"><ErrorState message={error} onRetry={load} /></PageLayout>

  const { employee_id, employee_name, total_present, total_absent, records } = data
  const totalDays = total_present + total_absent
  const rate = totalDays > 0 ? Math.round((total_present / totalDays) * 100) : 0

  return (
    <PageLayout
      title={employee_name}
      subtitle={employee_id}
      action={
        <Link to="/employees">
          <Button variant="secondary">Back to Employees</Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card title="Present Days" value={total_present} />
        <Card title="Absent Days" value={total_absent} />
        <Card title="Attendance Rate" value={`${rate}%`} />
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
            <div className="ml-auto flex gap-3">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
                className="w-40"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
                className="w-40"
              />
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(''); setDateTo('') }}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          {records.length === 0 ? (
            <EmptyState title="No records" description="No attendance records found for this period." />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((r) => (
                  <tr key={r.date} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={r.status === 'Present' ? 'success' : 'danger'}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
