import api from './api'
import SessionService from './SessionService'

const TokenService = {
  refreshAccessToken: async () => {
    const refreshToken = SessionService.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available.')

    const response = await api.post('/refresh-token', {
      refresh_token: refreshToken,
    })
    const { access_token, refresh_token: newRefreshToken } = response.data.data

    SessionService.setToken(access_token)
    SessionService.setRefreshToken(newRefreshToken)
    return access_token
  },
}

export default TokenService
