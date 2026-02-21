import { apiClient } from './client'

export function fetchAttendanceRecords(params = {}) {
  const query = new URLSearchParams(params).toString()
  const qs = query ? `?${query}` : ''
  return apiClient.get(`/attendance/${qs}`)
}

export function markAttendance(data) {
  return apiClient.post('/attendance/', data)
}
