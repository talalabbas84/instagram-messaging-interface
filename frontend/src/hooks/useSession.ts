import { useEffect, useState } from 'react'
import api from '../services/api'
import SessionService from '../services/sessionService'

export function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const authorize = async () => {
      const accessToken = SessionService.getToken()
      const refreshToken = SessionService.getRefreshToken()

      if (accessToken) {
        try {
          await api.get('/authorized-token', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          setIsLoggedIn(true)
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(
              'Error while authorizing with access token:',
              err.message,
            )
            setError('Authorization failed: ' + err.message)
          }

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
            } catch (err: unknown) {
              if (err instanceof Error) {
                console.error('Error while refreshing token:', err.message)
                setError('Failed to refresh token: ' + err.message)
              }
            }
          } else {
            setError('No access token or refresh token available')
          }
        }
      } else {
        setError('No access token found')
      }
    }

    authorize()
  }, [])

  const login = async (
    user: { username: string; password: string },
    isMessage,
    handleSendMessage,
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.post('/login', user)
      const { access_token, refresh_token } = response.data.data

      // Save tokens to session
      SessionService.setToken(access_token)
      SessionService.setRefreshToken(refresh_token)
      setIsLoggedIn(true)
      if(isMessage){
        handleSendMessage()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (
          err &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          err.response &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          err.response.data &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          err.response.data.detail
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setError(`Login failed: ${err.response.data.detail}`)
        } else {
          setError(`Login failed: ${err.message}`)
        }
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data: { detail: string } } }
        if (axiosError.response?.data?.detail) {
          setError(`Login failed: ${axiosError.response.data.detail}`)
        } else {
          setError('Login failed due to unknown reason')
        }
      } else {
        setError('An unknown error occurred during login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
      SessionService.clearToken()
      SessionService.clearRefreshToken()
      setIsLoggedIn(false)
    } catch (err: unknown) {
      if (err instanceof Error) {
        
        console.error('Logout failed:', err.message)
        setError(`Logout failed: ${err.message}`)
      } else {
        setError('An unknown error occurred during logout')
      }
    }
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to refresh token: ${err.message}`)
        } else {
          setError('Failed to refresh token due to an unexpected error.')
        }
      }
    } else {
      setError('No refresh token available.')
    }
  }

  return {
    isLoggedIn,
    login,
    logout,
    refreshToken,
    isLoading,
    error,
    setError,
  }
}
