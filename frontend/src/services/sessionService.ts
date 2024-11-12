// SessionService.ts
import StorageService from './StorageService'

/**
 * SessionService provides static methods for managing
 * access and refresh tokens in local storage.
 */
class SessionService {
  /**
   * Retrieves the access token from local storage.
   * @returns {string | null} The access token if it exists, otherwise null.
   */
  static getToken(): string | null {
    return StorageService.getItem('token')
  }

  /**
   * Stores the access token in local storage.
   * @param token - The access token to store.
   */
  static setToken(token: string): void {
    StorageService.setItem('token', token)
  }

  /**
   * Clears the access token from local storage.
   */
  static clearToken(): void {
    StorageService.removeItem('token')
  }

  /**
   * Retrieves the refresh token from local storage.
   * @returns {string | null} The refresh token if it exists, otherwise null.
   */
  static getRefreshToken(): string | null {
    return StorageService.getItem('refresh_token')
  }

  /**
   * Stores the refresh token in local storage.
   * @param token - The refresh token to store.
   */
  static setRefreshToken(token: string): void {
    StorageService.setItem('refresh_token', token)
  }

  /**
   * Clears the refresh token from local storage.
   */
  static clearRefreshToken(): void {
    StorageService.removeItem('refresh_token')
  }
}

export default SessionService
