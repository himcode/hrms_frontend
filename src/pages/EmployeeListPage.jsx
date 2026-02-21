import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { useToast } from '../components/ui/Toast'
import { fetchEmployees, deleteEmployee } from '../api/employees'

const deptColors = {
  HR: 'indigo', Engineering: 'success', Finance: 'neutral', Marketing: 'danger',
  Sales: 'success', Operations: 'neutral', IT: 'indigo', Legal: 'neutral',
}

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    setError(null)
    fetchEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteEmployee(deleteTarget.id)
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id))
      toast(`${deleteTarget.full_name} has been removed.`, 'success')
    } catch (err) {
      toast(err.message || 'Failed to delete employee.', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <PageLayout
      title="Employees"
      subtitle={`${employees.length} team member${employees.length !== 1 ? 's' : ''}`}
      action={
        <Link to="/employees/add">
          <Button>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Employee
          </Button>
        </Link>
      }
    >
      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Get started by adding your first team member."
          action={
            <Link to="/employees/add">
              <Button>Add Employee</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.full_name}</p>
                      <p className="text-xs text-gray-500">{emp.employee_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={deptColors[emp.department] || 'neutral'}>{emp.department}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(emp.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/employees/${emp.id}/attendance`}>
                        <Button variant="ghost" size="sm">Attendance</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(emp)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <span className="font-semibold">{deleteTarget?.full_name}</span>?
          This will also remove all their attendance records. This action cannot be undone.
        </p>
      </Modal>
    </PageLayout>
  )
}
