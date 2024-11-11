// services/sessionService.ts
import { User } from '../types/types'
import StorageService from './storageService'

class SessionService {
  static getStoredUser(): User | null {
    const user = StorageService.getItem('instagramUser')
    return user ? JSON.parse(user) : null
  }

  static saveUser(user: User): void {
    StorageService.setItem('instagramUser', JSON.stringify(user))
  }

  static clearUser(): void {
    StorageService.removeItem('instagramUser')
  }
}

export default SessionService
