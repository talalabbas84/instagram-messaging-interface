// services/storageService.ts

/**
 * A utility service for managing localStorage interactions.
 */
class StorageService {
  /**
   * Retrieves an item from localStorage.
   * @param key - The key of the item to retrieve.
   * @returns The value associated with the key, or null if not found.
   */
  static getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  /**
   * Sets an item in localStorage.
   * @param key - The key to associate with the stored value.
   * @param value - The value to store.
   */
  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  /**
   * Removes an item from localStorage.
   * @param key - The key of the item to remove.
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}

export default StorageService
