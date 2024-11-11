// services/sessionService.ts

/**
 * A service for managing user session data, including user details and authentication tokens.
 */
class SessionService {
  /**
   * Retrieves the stored user data from localStorage.
   * @returns The user object if found, otherwise null.
   */
  static getStoredUser() {
    const storedUser = localStorage.getItem('instagramUser')
    return storedUser ? JSON.parse(storedUser) : null
  }

  /**
   * Saves the user data (username and password) to localStorage.
   * @param user - The user object containing username and password.
   */
  static saveUser(user: { username: string; password: string }) {
    localStorage.setItem('instagramUser', JSON.stringify(user))
  }

  /**
   * Clears the stored user data from localStorage.
   */
  static clearUser() {
    localStorage.removeItem('instagramUser')
  }

  /**
   * Retrieves the access token from localStorage.
   * @returns The access token as a string, or null if not found.
   */
  static getToken() {
    return localStorage.getItem('token')
  }

  /**
   * Stores the access token in localStorage.
   * @param token - The access token to store.
   */
  static setToken(token: string) {
    localStorage.setItem('token', token)
  }

  /**
   * Clears the access token from localStorage.
   */
  static clearToken() {
    localStorage.removeItem('token')
  }

  /**
   * Retrieves the refresh token from localStorage.
   * @returns The refresh token as a string, or null if not found.
   */
  static getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  /**
   * Stores the refresh token in localStorage.
   * @param token - The refresh token to store.
   */
  static setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token)
  }

  /**
   * Clears the refresh token from localStorage.
   */
  static clearRefreshToken() {
    localStorage.removeItem('refresh_token')
  }
}

export default SessionService
