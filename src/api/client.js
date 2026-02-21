const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An unexpected error occurred' }))
    const err = new Error(error.detail || 'Request failed')
    err.status = response.status
    err.data = error
    throw err
  }

  if (response.status === 204) return null
  return response.json()
}
