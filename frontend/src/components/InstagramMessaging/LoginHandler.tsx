import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { User } from '../../types'

// Props definition for the LoginHandler component
interface LoginHandlerProps {
  user: User
  setUser: (user: User) => void
  onLogin: () => Promise<void> // Function to handle the login process
  isLoading: boolean // Loading state to indicate if login is in progress
  error: string | null // Error message, if any, to display on login failure
}

// LoginHandler component
export function LoginHandler({
  user,
  setUser,
  onLogin,
  isLoading,
}: LoginHandlerProps) {
  const [showPassword, setShowPassword] = useState(false) // Toggle password visibility

  // Toggle password visibility handler
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault() // Prevent default form submission
        onLogin() // Trigger login function passed as prop
      }}
      className="space-y-4"
    >
      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Username
        </Label>
        <Input
          id="username"
          placeholder="Your Instagram username"
          value={user.username || ''}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Password Input with Toggle Visibility */}
      <div className="space-y-2 relative">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            value={user.password || ''}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner if isLoading is true
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </>
        )}
      </Button>
    </form>
  )
}
