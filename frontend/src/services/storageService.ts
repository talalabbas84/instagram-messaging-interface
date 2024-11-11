// services/storageService.ts

class StorageService {
  static getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}

export default StorageService
