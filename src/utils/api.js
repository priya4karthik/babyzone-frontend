import axios from 'axios'


// This will look for your .env variable first
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
})

// ── Attach access token to every request ──────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Handle 401 — refresh token and retry ──────────────────────
let isRefreshing = false

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      if (isRefreshing) return Promise.reject(err)
      isRefreshing = true

      const refresh = localStorage.getItem('refresh_token')

      if (refresh) {
        try {
          const { data } = await axios.post('${BASE_URL}/api/users/token/refresh/', { refresh })

          localStorage.setItem('access_token',  data.access)
          localStorage.setItem('refresh_token', data.refresh)

          original.headers.Authorization = `Bearer ${data.access}`
          isRefreshing = false
          return api(original)

        } catch {
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/'
        }
      } else {
        localStorage.removeItem('access_token')
        window.location.href = '/'
      }
    }

    return Promise.reject(err)
  }
)

export default api