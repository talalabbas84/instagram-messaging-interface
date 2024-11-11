import axios from 'axios'
import SessionService from './sessionService'

// Create an Axios instance with the base API URL and default headers
const api = axios.create({
  baseURL: 'http://0.0.0.0:8000', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authorization token to each request
api.interceptors.request.use(
  (config) => {
    const token = SessionService.getToken() // Retrieve the access token from SessionService
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Set the Authorization header
    }
    return config
  },
  (error) => {
    return Promise.reject(error) // Reject the request if an error occurs
  },
)

// Response interceptor to handle token refresh on 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response, // Pass through successful responses

  // Handle errors, especially 401 Unauthorized for token expiration
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = SessionService.getRefreshToken() // Retrieve the refresh token

      if (refreshToken) {
        try {
          // Attempt to refresh the access token using the refresh token
          const response = await axios.post(
            'http://localhost:8000/refresh-token',
            {
              refresh_token: refreshToken,
            },
          )
          const { access_token, refresh_token: newRefreshToken } =
            response.data.data

          // Save the new tokens to session storage
          SessionService.setToken(access_token)
          SessionService.setRefreshToken(newRefreshToken)

          // Update the original request's Authorization header with the new token
          error.config.headers['Authorization'] = `Bearer ${access_token}`

          // Retry the original request with the new access token
          return axios(error.config)
        } catch (refreshError) {
          // Handle token refresh failure (e.g., redirect to login or show an error)
          SessionService.clearToken()
          SessionService.clearRefreshToken()
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error) // Reject other errors
  },
)

export default api
