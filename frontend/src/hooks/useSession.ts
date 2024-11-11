import { useEffect, useState } from 'react'
import api from '../services/api'
import SessionService from '../services/sessionService'
import { User } from '../types/types'

export function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('useSession.ts: useSession', isLoggedIn)

  useEffect(() => {
    const authorize = async () => {
      console.log('useSession.ts: authorize')
      const accessToken = SessionService.getToken()
      const refreshToken = SessionService.getRefreshToken()
      if (accessToken) {
        try {
          // Try to authorize using the access token
          await api.get('/authorized-token', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          setIsLoggedIn(true)
        } catch (err) {
          // If access token is invalid or expired, try refreshing with the refresh token
          if (refreshToken) {
            try {
              const response = await api.post('/refresh-token', {
                refresh_token: refreshToken,
              })
              const { access_token, refresh_token: newRefreshToken } =
                response.data.data
              // Update the new tokens
              SessionService.setToken(access_token)
              SessionService.setRefreshToken(newRefreshToken)
              setIsLoggedIn(true)
            } catch (err) {
              setError('Failed to authorize')
            }
          }
        }
      }
    }
    authorize()
  }, [])

  const login = async (user: User) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/login', {
        username: user.username,
        password: user.password,
      })
      const { access_token, refresh_token } = response.data.data
      // Save the tokens
      SessionService.setToken(access_token)
      SessionService.setRefreshToken(refresh_token)
      setIsLoggedIn(true)
    } catch (err) {
      setError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    SessionService.clearUser()
    SessionService.clearToken()
    SessionService.clearRefreshToken()
    setUser(null)
    setIsLoggedIn(false)
  }

  const refreshToken = async () => {
    const refreshToken = SessionService.getRefreshToken()
    if (refreshToken) {
      try {
        const response = await api.post('/refresh-token', {
          refresh_token: refreshToken,
        })
        const { access_token, refresh_token: newRefreshToken } =
          response.data.data
        // Save the new tokens
        SessionService.setToken(access_token)
        SessionService.setRefreshToken(newRefreshToken)
        return access_token
      } catch (err) {
        setError('Failed to refresh token')
      }
    }
  }

  return {
    isLoggedIn,
    user,
    login,
    logout,
    refreshToken,
    setUser,
    isLoading,
    error,
  }
}
