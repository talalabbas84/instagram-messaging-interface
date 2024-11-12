import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { useSessionContext } from '../../context/SessionContext'
import { JsonData, JsonInputForm } from './JsonInputForm'
import { LoginHandler } from './LoginHandler'
import { MessageSender } from './MessageSender'

export default function InstagramMessaging() {
  // Destructure context values and functions from SessionContext
  const {
    isLoggedIn,
    user,
    setUser,
    login,
    logout,
    sendMessage,
    isLoading,
    error,
    setError,
    setMessage,
    message,
  } = useSessionContext()

  const [success, setSuccess] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonData, setJsonData] = useState<JsonData | null>(null)
  const [activeTab, setActiveTab] = useState<'manual' | 'json'>('manual')


  // Handle login and message send for JSON input in sequence
  const handleSubmitFromJson = async () => {
    if (
      !user.username ||
      !user.password ||
      !message.recipient ||
      !message.message
    ) {
      setError('Please fill in all fields in JSON input')
      return
    }
    try {
      // Login first, then send the message if login is successful
      await login(user, async () => {
        await handleSendMessage()
      })
      setUser({ ...user, password: '' }) // Clear password after login
    } catch (error) {
      console.log(error)
    }
  }

  // Handle manual login submission without sending a message
  const handleManualLogin = async () => {
    if (!user.username || !user.password) {
      setError('Please fill in all fields')
      return
    }
    await login(user, () => {
      setUser({ ...user, password: '' }) // Clear password after login
      setError('')
    })
  }

  // Send the message after confirming recipient and message fields are filled
  const handleSendMessage = async () => {
    if (!message.recipient || !message.message) {
      setError('Please fill in all fields')
      return
    }

    try {
      await sendMessage(message)
      setSuccess(`Message sent to ${message.recipient}!`)
      setMessage({ recipient: '', message: '' }) // Clear message fields after sending
    } catch (error) {
      console.log(error)
    }
  }

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
          {/* Display success or error messages */}
          {success && <p className="text-green-600 text-center">{success}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {/* Tab controls to switch between Manual and JSON input modes */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'manual' | 'json')}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="json">JSON Input</TabsTrigger>
            </TabsList>
            {/* Manual Input Tab Content */}
            <TabsContent value="manual">
              {isLoggedIn ? (
                <MessageSender
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              ) : (
                <LoginHandler
                  user={user}
                  setUser={setUser}
                  onLogin={handleManualLogin} // Only login for manual input
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </TabsContent>
            {/* JSON Input Tab Content */}
            <TabsContent value="json">
              <JsonInputForm
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                jsonData={jsonData}
                setJsonData={setJsonData}
                handleSubmit={handleSubmitFromJson} // Sequential login and send message for JSON
                setUser={setUser}
                setMessage={setMessage}
                setError={setError}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        {/* Logout button displayed if user is logged in */}
        {isLoggedIn && (
          <button
            onClick={logout}
            className="w-full p-2 mt-4 bg-gray-200 text-center rounded"
          >
            Logout
          </button>
        )}
      </Card>
    </div>
  )
}
