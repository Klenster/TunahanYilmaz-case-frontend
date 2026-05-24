import axios from 'axios'

// Tarayıcıdan direkt backend'e istek gider
// Next.js rewrites sadece server component'larda çalışır
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: `${BASE_URL}/api` })

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dpp-auth')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('dpp-auth')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

export default api