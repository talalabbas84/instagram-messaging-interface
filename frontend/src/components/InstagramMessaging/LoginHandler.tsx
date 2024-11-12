import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { User } from '../../types'

interface LoginHandlerProps {
  user: User
  setUser: (user: User) => void
  onLogin: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function LoginHandler({
  user,
  setUser,
  onLogin,
  isLoading,
}: LoginHandlerProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onLogin()
      }}
      className="space-y-4"
    >
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </>
        )}
      </Button>
    </form>
  )
}
