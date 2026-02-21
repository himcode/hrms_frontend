import { apiClient } from './client'

export function fetchEmployees() {
  return apiClient.get('/employees/')
}

export function fetchEmployee(id) {
  return apiClient.get(`/employees/${id}/`)
}

export function createEmployee(data) {
  return apiClient.post('/employees/', data)
}

export function deleteEmployee(id) {
  return apiClient.delete(`/employees/${id}/`)
}

export function fetchEmployeeAttendance(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  const qs = query ? `?${query}` : ''
  return apiClient.get(`/employees/${id}/attendance/${qs}`)
}

export function fetchDashboard() {
  return apiClient.get('/employees/dashboard/')
}
