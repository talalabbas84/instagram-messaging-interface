import { createContext, ReactNode, useContext, useState } from 'react'
import { useSession } from '../hooks/useSession'
import { Message, User } from '../types'

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

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, login, logout, isLoading, sendMessage, error, setError } =
    useSession()
  const [user, setUser] = useState<User>({ username: '', password: '' })
  const [message, setMessage] = useState<Message>({
    recipient: '',
    message: '',
  })

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

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if (!context)
    throw new Error('useSessionContext must be used within a SessionProvider')
  return context
}
