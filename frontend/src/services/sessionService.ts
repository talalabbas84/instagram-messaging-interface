// services/sessionService.ts
class SessionService {
  static getStoredUser() {
    const storedUser = localStorage.getItem('instagramUser')
    return storedUser ? JSON.parse(storedUser) : null
  }

  static saveUser(user: { username: string; password: string }) {
    localStorage.setItem('instagramUser', JSON.stringify(user))
  }

  static clearUser() {
    localStorage.removeItem('instagramUser')
  }

  static getToken() {
    return localStorage.getItem('token')
  }

  static setToken(token: string) {
    localStorage.setItem('token', token)
  }

  static clearToken() {
    localStorage.removeItem('token')
  }

  static getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  static setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token)
  }

  static clearRefreshToken() {
    localStorage.removeItem('refresh_token')
  }
}

export default SessionService
