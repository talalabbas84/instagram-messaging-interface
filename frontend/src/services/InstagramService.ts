import { Message, User } from '../types'
import api from './api'

// Helper function to create authorization headers for authenticated requests
const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

const InstagramService = {
  /**
   * Authenticates a user by sending their credentials to the login endpoint.
   * @param user - The User object containing username and password
   * @returns The response data with access and refresh tokens upon successful login
   */
  login: async (user: User) => {
    const response = await api.post('/login', user)
    return response.data
  },

  /**
   * Sends a direct message to an Instagram user.
   * @param message - The Message object containing recipient and message content
   * @param token - The user's access token for authentication
   * @returns The response data indicating success or failure of message sending
   */
  sendMessage: async (message: Message, token: string) => {
    const response = await api.post('/send-message', message, {
      headers: getAuthHeader(token), // Adds Authorization header to the request
    })
    return response.data
  },

  /**
   * Checks if the provided token is still valid by verifying with the backend.
   * @param token - The access token to be validated
   * @returns The response data indicating token validity or invalidity
   */
  checkTokenAuthorization: async (token: string) => {
    const response = await api.get('/authorized-token', {
      headers: getAuthHeader(token), // Adds Authorization header to validate token
    })
    return response.data
  },

  /**
   * Logs out the user by making a request to the logout endpoint.
   * @returns The response data confirming successful logout
   */
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },
}

export default InstagramService
