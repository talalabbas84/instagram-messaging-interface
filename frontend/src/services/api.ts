// api.ts
import axios from 'axios'
import SessionService from './SessionService'

// Create a new axios instance with a pre-defined base URL and headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000', // Base URL for the API, can be overridden by environment variable
  headers: {
    'Content-Type': 'application/json', // Set default content type to JSON
  },
})

// Request interceptor to automatically add the authorization token to every request
api.interceptors.request.use(
  (config) => {
    // Retrieve the access token from SessionService
    const token = SessionService.getToken()
    if (token) {
      // Attach the token to the Authorization header if it exists
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  // Handle request errors, if any occur before sending the request
  (error) => Promise.reject(error),
)

export default api
