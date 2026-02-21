import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { createEmployee } from '../api/employees'
import { DEPARTMENTS } from '../constants/departments'

export default function AddEmployeePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ full_name: '', email: '', department: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.department) errs.department = 'Department is required.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await createEmployee(form)
      toast('Employee added successfully!', 'success')
      navigate('/employees')
    } catch (err) {
      const errorData = err.response?.data || {}
      if (errorData && typeof errorData === 'object') {
        const serverErrors = {}
        for (const [key, val] of Object.entries(errorData)) {
          serverErrors[key] = Array.isArray(val) ? val[0] : val
        }
        setErrors(serverErrors)
      } else {
        toast(err.message || 'Failed to add employee.', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <PageLayout title="Add Employee" subtitle="Register a new team member">
      <div className="mx-auto max-w-lg">
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={form.full_name}
              onChange={handleChange('full_name')}
              error={errors.full_name}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@company.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <Select
              label="Department"
              placeholder="Select a department"
              options={DEPARTMENTS}
              value={form.department}
              onChange={handleChange('department')}
              error={errors.department}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit" loading={submitting} className="flex-1">
              Add Employee
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
