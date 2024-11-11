// hooks/useSession.ts
import { useEffect, useState } from 'react'
import { User } from '../types/types'
import SessionService from '../services/sessionService'

export function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = SessionService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      setIsLoggedIn(true)
    }
  }, [])

  const login = (user: User) => {
    setUser(user)
    setIsLoggedIn(true)
    SessionService.saveUser(user) // Save user to storage
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    SessionService.clearUser() // Clear user from storage
  }

  return { isLoggedIn, user, login, logout, setUser }
}
