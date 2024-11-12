import InstagramService from '@/services/InstagramService'
import SessionService from '@/services/SessionService'
import TokenService from '@/services/TokenService'
import { useEffect, useState } from 'react'
import { Message, User } from '../types'
import { useError } from './useError'

export function useSession() {
  const { showError: setError, clearError, error } = useError() // Use showError and clearError
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const authorize = async () => {
      console.log('Checking token authorization')
      const accessToken = SessionService.getToken()
      console.log('Access token:', accessToken)
      if (accessToken) {
        await handleTokenAuthorization(accessToken)
      }
    }
    authorize()
  }, [])

  const handleTokenAuthorization = async (accessToken: string) => {
    try {
      await InstagramService.checkTokenAuthorization(accessToken)
      setIsLoggedIn(true)
    } catch {
      await attemptTokenRefresh()
    }
  }

  const attemptTokenRefresh = async () => {
    try {
      await TokenService.refreshAccessToken()
      setIsLoggedIn(true)
    } catch {
      setError('Failed to refresh token')
      SessionService.clearToken()
      SessionService.clearRefreshToken()
    }
  }

  const sendMessage = async (message: Message) => {
    try {
      clearError()

      const accessToken = SessionService.getToken()
      if (!accessToken) throw new Error('No access token available')

      await InstagramService.sendMessage(message, accessToken)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle error, check if it’s due to expired token
      if (err?.response?.status === 401) {
        await attemptTokenRefresh()
        const newAccessToken = SessionService.getToken()
        if (newAccessToken) {
          // Retry sending the message after refreshing the token
          try {
            await InstagramService.sendMessage(message, newAccessToken)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (retryError: any) {
            setError(
              retryError?.response?.data?.detail ||
                'Failed to send message after retry',
            )
          }
          throw err
        }
      } else {
        console.log(err, 'erdsadsadadsror')
        setError(err?.response?.data?.detail || 'Failed to send message')
        throw err
      }
    }
  }

  const login = async (user: User, onSuccess: () => void) => {
    setIsLoading(true)
    clearError()

    try {
      const response = await InstagramService.login(user)
      const { access_token, refresh_token } = response.data
      SessionService.setToken(access_token)
      SessionService.setRefreshToken(refresh_token)
      setIsLoggedIn(true)
      console.log('Logged in')
      onSuccess()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await InstagramService.logout()
      SessionService.clearToken()
      SessionService.clearRefreshToken()
      setIsLoggedIn(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      SessionService.clearToken()
      SessionService.clearRefreshToken()

      setError(`Logout failed: ${err.message || 'Unknown error'}`)
    }
  }

  return {
    isLoggedIn,
    login,
    logout,
    sendMessage, // Expose sendMessage function
    isLoading,
    error,
    setError,
  }
}
