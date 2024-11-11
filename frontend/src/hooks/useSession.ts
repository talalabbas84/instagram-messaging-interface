import { useEffect, useState } from 'react'
import api from '../services/api'
import SessionService from '../services/sessionService'

export function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('useSession.ts: useSession', isLoggedIn)

   useEffect(() => {
     const authorize = async () => {
       console.log('useSession.ts: authorize')
       const accessToken = SessionService.getToken()
       const refreshToken = SessionService.getRefreshToken()
       console.log('useSession.ts: authorize', accessToken, refreshToken)

       if (accessToken) {
         try {
           // Try to authorize using the access token
           await api.get('/authorized-token', {
             headers: { Authorization: `Bearer ${accessToken}` },
           })
           setIsLoggedIn(true)
         } catch (err: unknown) {
           // If access token is invalid or expired, try refreshing with the refresh token
           if (err instanceof Error) {
             console.error(
               'Error while authorizing with access token:',
               err.message,
             )
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
                 setError('Failed to refresh token')
                 console.error('Error while refreshing token:', err.message)
               } else {
                 setError('Failed to authorize')
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

const login = async (user: { username: string; password: string }) => {
  try {
    setIsLoading(true)
    setError(null)

    // Perform login request
    const response = await api.post('/login', user)
    const { access_token, refresh_token } = response.data.data

    // Save tokens to session
    SessionService.setToken(access_token)
    SessionService.setRefreshToken(refresh_token)
    setIsLoggedIn(true)
  } catch (err: unknown) {
    // Handling different shapes of errors
    if (err instanceof Error) {
      // If it's a generic error, log it
      setError(err.message)
    } else if (err && typeof err === 'object' && 'response' in err) {
      // If error has a response (AxiosError or similar), check for response details
      const axiosError = err as { response?: { data: { detail: string } } }
      if (axiosError.response?.data?.detail) {
        setError(axiosError.response.data.detail)
      } else {
        setError('Login failed due to unknown reason')
      }
    } else {
      setError('An unknown error occurred')
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
    } else {
      console.error('An unknown error occurred during logout')
    }
    setError('Failed to logout')
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
          // In case of an error, log it and set an appropriate error message
          setError(`Failed to refresh token: ${err.message}`)
          console.error('Error while refreshing token:', err.message)
        } else {
          // Handle cases where the error is not an instance of Error (e.g., unexpected response formats)
          setError('Failed to refresh token due to an unexpected error.')
          console.error('Unexpected error while refreshing token:', err)
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
  }
}
