import { createContext, ReactNode, useContext, useState } from 'react'
import { useSession } from '../hooks/useSession'
import { Message, User } from '../types'

// Define the types for the session context
interface SessionContextType {
  isLoggedIn: boolean
  user: User
  message: Message
  setUser: (user: User) => void
  login: (user: User, onSuccess: () => void) => Promise<void>
  sendMessage: (message: Message) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  setError: (error: string) => void
  setMessage: (message: Message) => void
}

// Create a context with the defined type or undefined by default
const SessionContext = createContext<SessionContextType | undefined>(undefined)

// Provider component to wrap parts of the app that need session data
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Use the custom hook `useSession` to handle session actions and state
  const { isLoggedIn, login, logout, isLoading, sendMessage, error, setError } =
    useSession()

  // Local states for user and message
  const [user, setUser] = useState<User>({ username: '', password: '' })
  const [message, setMessage] = useState<Message>({
    recipient: '',
    message: '',
  })

  // Pass all session-related data and actions to context
  return (
    <SessionContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        message,
        login,
        sendMessage,
        logout,
        isLoading,
        error,
        setError,
        setMessage,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

// Custom hook to use the session context
export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
