import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

export function fetchAttendanceRecords(params = {}) {
  const query = new URLSearchParams(params).toString()
  const qs = query ? `?${query}` : ''
  return axios.get(`${API}/api/attendance/${qs}`)
}

export function markAttendance(data) {
  return axios.post(`${API}/api/attendance/`, data)
}
