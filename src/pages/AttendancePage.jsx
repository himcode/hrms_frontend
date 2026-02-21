import { useState, useEffect } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { useToast } from '../components/ui/Toast'
import { fetchEmployees } from '../api/employees'
import { fetchAttendanceRecords, markAttendance } from '../api/attendance'

export default function AttendancePage() {
  const toast = useToast()
  const [employees, setEmployees] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [recordsLoading, setRecordsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mark attendance form
  const [form, setForm] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Filters
  const [filters, setFilters] = useState({ employee: '', date: '' })

  useEffect(() => {
    fetchEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const loadRecords = () => {
    setRecordsLoading(true)
    const params = {}
    if (filters.employee) params.employee = filters.employee
    if (filters.date) params.date = filters.date
    fetchAttendanceRecords(params)
      .then((res) => setRecords(res.data))
      .catch(() => {})
      .finally(() => setRecordsLoading(false))
  }

  useEffect(loadRecords, [filters])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.employee) errs.employee = 'Select an employee.'
    if (!form.date) errs.date = 'Date is required.'
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }
    setFormErrors({})
    setSubmitting(true)
    try {
      await markAttendance(form)
      toast('Attendance marked successfully!', 'success')
      setForm((prev) => ({ ...prev, employee: '', status: 'Present' }))
      loadRecords()
    } catch (err) {
      const errorData = err.response?.data || {}
      if (errorData && typeof errorData === 'object') {
        const msg = errorData.non_field_errors?.[0] || errorData.detail || Object.values(errorData).flat()[0] || 'Failed to mark attendance.'
        toast(msg, 'error')
      } else {
        toast(err.message || 'Failed to mark attendance.', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.employee_id} - ${e.full_name}`,
  }))

  if (loading) return <PageLayout title="Attendance"><Spinner size="lg" /></PageLayout>
  if (error) return <PageLayout title="Attendance"><ErrorState message={error} /></PageLayout>

  return (
    <PageLayout title="Attendance" subtitle="Mark and view attendance records">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Mark Attendance */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Select
                label="Employee"
                placeholder="Select employee"
                options={employeeOptions}
                value={form.employee}
                onChange={(e) => { setForm((p) => ({ ...p, employee: e.target.value })); setFormErrors({}) }}
                error={formErrors.employee}
              />
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                error={formErrors.date}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <div className="flex gap-4">
                  {['Present', 'Absent'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" loading={submitting} className="w-full">
                Mark Attendance
              </Button>
            </form>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Records</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                <Select
                  placeholder="All employees"
                  options={employeeOptions}
                  value={filters.employee}
                  onChange={(e) => setFilters((p) => ({ ...p, employee: e.target.value }))}
                  className="w-56"
                />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
                  className="w-44"
                />
                {(filters.employee || filters.date) && (
                  <Button variant="ghost" size="sm" onClick={() => setFilters({ employee: '', date: '' })}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4">
              {recordsLoading ? (
                <Spinner />
              ) : records.length === 0 ? (
                <EmptyState title="No records found" description="Mark attendance or adjust your filters." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Employee</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {records.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{r.employee_name}</p>
                            <p className="text-xs text-gray-500">{r.employee_id_display}</p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                            {new Date(r.date + 'T00:00:00').toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <Badge variant={r.status === 'Present' ? 'success' : 'danger'}>{r.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
