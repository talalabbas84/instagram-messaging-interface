import { useState } from 'react'

export function useError() {
  // State to store the current error message or null if there's no error
  const [error, setError] = useState<string | null>(null)

  // Function to set a specific error message
  const showError = (message: string) => {
    setError(message)
  }

  // Function to clear the current error, setting it back to null
  const clearError = () => {
    setError(null)
  }

  return {
    error, // The current error message, or null if there's no error
    showError, // Function to set a new error message
    clearError, // Function to clear the error message
  }
}
