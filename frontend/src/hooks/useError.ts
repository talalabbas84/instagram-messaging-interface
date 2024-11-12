import { useState } from 'react'

export function useError() {
  const [error, setError] = useState<string | null>(null)

  const showError = (message: string) => {
    setError(message)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    error,
    showError,
    clearError,
  }
}
