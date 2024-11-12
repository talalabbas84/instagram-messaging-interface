import InstagramService from '@/services/InstagramService'
import SessionService from '@/services/SessionService'
import TokenService from '@/services/TokenService'
import { useEffect, useState } from 'react'
import { Message, User } from '../types'
import { useError } from './useError'

export function useSession() {
  const { showError: setError, clearError, error } = useError() // Import error handling hooks
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check authorization on component mount
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

  // Validate and refresh the access token if needed
  const handleTokenAuthorization = async (accessToken: string) => {
    try {
      await InstagramService.checkTokenAuthorization(accessToken)
      setIsLoggedIn(true)
    } catch {
      await attemptTokenRefresh()
    }
  }

  // Attempt to refresh the token if expired
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

  // Send a message after ensuring the user is logged in and the token is valid
  const sendMessage = async (message: Message) => {
    try {
      setIsLoading(true)
      clearError()
      const accessToken = SessionService.getToken()
      if (!accessToken) throw new Error('No access token available')

      await InstagramService.sendMessage(message, accessToken)
      setIsLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle error, retry if it’s due to an expired token
      if (err?.response?.status === 401) {
        await attemptTokenRefresh()
        const newAccessToken = SessionService.getToken()
        if (newAccessToken) {
          try {
            await InstagramService.sendMessage(message, newAccessToken)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (retryError: any) {
            setError(
              retryError?.response?.data?.detail ||
                'Failed to send message after retry',
            )
            throw retryError
          }
        } else {
          throw err
        }
      } else {
        setError(err?.response?.data?.detail || 'Failed to send message')
        throw err
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Log in the user, handle token storage, and run any callback on success
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

  // Log out the user and clear tokens from session
  const logout = async () => {
    try {
      await InstagramService.logout()
      SessionService.clearToken()
      SessionService.clearRefreshToken()
      setIsLoggedIn(false)
      clearError()

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
    sendMessage, // Expose sendMessage function for messaging functionality
    isLoading,
    error,
    setError,
  }
}
