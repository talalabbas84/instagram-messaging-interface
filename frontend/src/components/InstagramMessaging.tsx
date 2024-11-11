'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { useSession } from '../hooks/useSession'
import api from '../services/api'; // API helper for making requests
import { Message, User } from '../types/types'
import { JsonInputForm } from './JsonInputForm'
import { LoginForm } from './LoginForm'
import { MessageForm } from './MessageForm'

export default function InstagramMessaging() {
  const {  isLoggedIn, login, logout, refreshToken, error, setError } =
    useSession()

  const [user, setUser] = useState<User>({
    username: '',
    password: '',
  })

  const [message, setMessage] = useState<Message>({
    recipient: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [activeTab, setActiveTab] = useState<'manual' | 'json'>('manual')

  // Login Handler
  const handleLogin = async (isMessage=false) => {
    // if empty username or password
    if (!user.username || !user.password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError(null)
    await login(user,isMessage, handleSendMessage)

    setIsLoading(false)

  }

  // Send Message Handler
  const handleSendMessage = async () => {
    console.log('handleSendMessage', 'dsadsa')
    setIsLoading(true)
    setError(null)
    if (!message.recipient || !message.message) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const accessToken = localStorage.getItem('token')
       await api.post(
        '/send-message',
        {
          recipient: message.recipient,
          message: message.message,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      setSuccess(`Message sent to ${message.recipient}!`)
      setMessage({ recipient: '', message: '' })
    } catch (err : unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (err.response && err.response.data && err.response.data.detail) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError(err.response.data.detail)
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (err.response && err.response.status === 401) {
          // If 401 error occurs, try refreshing the token
          await refreshToken()
          handleSendMessage() // Retry sending message after token refresh
        } else {
          setError('Failed to send message')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle JSON Input
  const handleJsonChange = (input: string) => {
    setJsonInput(input)
    setError(null)
    try {
      const parsedJson: User & Message = JSON.parse(input)
      setUser({ username: parsedJson.username, password: parsedJson.password })
      setMessage({
        recipient: parsedJson.recipient,
        message: parsedJson.message,
      })
    } catch {
      setError('Invalid JSON format')
    }
  }

  const handleSubmit = () => {
    if (!user.username || !user.password || !message.recipient || !message.message) {
      setError('Please fill in all fields')
      return
    }
    console.log('User:', user, 'Message:', message)
  
    // handleSendMessage()
    // login and send message
    try {
          handleLogin(true)
      
    } catch (error) {
      console.log(error, 'error')
      
    }
    // handleSendMessage()
    
  }

  console.log(error, 'error')


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Instagram Messaging
          </CardTitle>
          <CardDescription className="text-center">
            Send messages via Instagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && <p className="text-green-600 text-center">{success}</p>}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'manual' | 'json')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="json">JSON Input</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              {isLoggedIn ? (
                <MessageForm
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  error={error}
                />
              ) : (
                <LoginForm
                  user={user}
                  setUser={setUser}
                  onLogin={handleLogin}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </TabsContent>
            <TabsContent value="json">
              <JsonInputForm
                jsonInput={jsonInput}
                setJsonInput={handleJsonChange}
                error={error}
                handleSubmit={handleSubmit}
                setUser={setUser}
                setMessage={setMessage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        {isLoggedIn && (
          <Button variant="outline" onClick={logout} className="w-full">
            Logout
          </Button>
        )}
      </Card>
    </div>
  )
}
