// services/api.ts
import axios from 'axios'

// Create an Axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Unauthorized
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await api.post('/refresh-token', {
            refresh_token: refreshToken,
          })
          localStorage.setItem('token', response.data.access_token)
          // Retry the failed request with the new token
          error.config.headers['Authorization'] =
            `Bearer ${response.data.access_token}`
          return axios(error.config)
        }
      } catch (err) {
        console.error('Token refresh failed', err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
