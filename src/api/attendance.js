import { apiClient } from './client'

export function fetchAttendanceRecords(params = {}) {
  const query = new URLSearchParams(params).toString()
  const qs = query ? `?${query}` : ''
  return apiClient(`/attendance/${qs}`)
}

export function markAttendance(data) {
  return apiClient('/attendance/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
