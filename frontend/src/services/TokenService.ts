// TokenService.ts
import api from './api'
import SessionService from './SessionService'

/**
 * TokenService handles operations related to token management,
 * specifically refreshing the access token using a valid refresh token.
 */
const TokenService = {
  /**
   * Refreshes the access token using the stored refresh token.
   * @throws Will throw an error if no refresh token is available.
   * @returns {Promise<string>} The new access token.
   */
  refreshAccessToken: async (): Promise<string> => {
    // Retrieve the refresh token from session storage
    const refreshToken = SessionService.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available.')

    // Send a request to refresh the access token
    const response = await api.post('/refresh-token', {
      refresh_token: refreshToken,
    })

    // Extract the new tokens from the response
    const { access_token, refresh_token: newRefreshToken } = response.data.data

    // Store the new tokens in session storage
    SessionService.setToken(access_token)
    SessionService.setRefreshToken(newRefreshToken)

    // Return the new access token for immediate use
    return access_token
  },
}

export default TokenService
