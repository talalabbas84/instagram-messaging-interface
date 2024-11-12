import axios from 'axios'
import SessionService from './SessionService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = SessionService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default api
