// SessionService.ts
import StorageService from './StorageService'

class SessionService {
  static getToken(): string | null {
    return StorageService.getItem('token')
  }

  static setToken(token: string): void {
    StorageService.setItem('token', token)
  }

  static clearToken(): void {
    StorageService.removeItem('token')
  }

  static getRefreshToken(): string | null {
    return StorageService.getItem('refresh_token')
  }

  static setRefreshToken(token: string): void {
    StorageService.setItem('refresh_token', token)
  }

  static clearRefreshToken(): void {
    StorageService.removeItem('refresh_token')
  }
}

export default SessionService
