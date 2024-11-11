import axios from 'axios'
import SessionService from './sessionService'

const api = axios.create({
  baseURL: 'http://0.0.0.0:8000', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = SessionService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Token refresh interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Refresh token if expired
      const refreshToken = SessionService.getRefreshToken()
      const response = await axios.post('http://localhost:8000/refresh-token', {
        refresh_token: refreshToken,
      })
      const { access_token, refresh_token } = response.data.data
      SessionService.setToken(access_token) // Save new tokens
      SessionService.setRefreshToken(refresh_token)
      error.config.headers['Authorization'] = `Bearer ${access_token}`
      return axios(error.config)
    }
    return Promise.reject(error)
  },
)

export default api
