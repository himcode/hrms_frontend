import { apiClient } from './client'

export function fetchEmployees() {
  return apiClient('/employees/')
}

export function fetchEmployee(id) {
  return apiClient(`/employees/${id}/`)
}

export function createEmployee(data) {
  return apiClient('/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteEmployee(id) {
  return apiClient(`/employees/${id}/`, {
    method: 'DELETE',
  })
}

export function fetchEmployeeAttendance(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  const qs = query ? `?${query}` : ''
  return apiClient(`/employees/${id}/attendance/${qs}`)
}

export function fetchDashboard() {
  return apiClient('/employees/dashboard/')
}
