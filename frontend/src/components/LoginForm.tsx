// components/LoginForm.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, LogIn } from 'lucide-react'
import { User } from '../types/types'

interface LoginFormProps {
  user: User
  setUser: (user: User) => void
  onLogin: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function LoginForm({
  user,
  setUser,
  onLogin,
  isLoading,
  error,
}: LoginFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onLogin()
      }}
      className="space-y-4"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}
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
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password"
          value={user.password || ''}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full"
        />
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
