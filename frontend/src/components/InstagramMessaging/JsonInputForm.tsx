import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export interface JsonData {
  username: string
  password: string
  recipient: string
  message: string
}

interface JsonInputFormProps {
  jsonInput: string
  setJsonInput: (input: string) => void
  jsonData: JsonData | null
  setJsonData: (data: JsonData | null) => void
  setUser: (user: { username: string; password: string }) => void
  setMessage: (message: { recipient: string; message: string }) => void
  handleSubmit: () => Promise<void>
  handleSendMessage: () => Promise<void>
  setError: (error: string) => void
}

export function JsonInputForm({
  jsonInput,
  setJsonInput,
  jsonData,
  setJsonData,
  setUser,
  setMessage,
  handleSubmit,
  setError,
}: JsonInputFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  // Handle JSON input changes and validate JSON format
  const handleJsonChange = (input: string) => {
    setJsonInput(input)
    setError('')
    try {
      const parsedJson: JsonData = JSON.parse(input)
      if (
        parsedJson.username &&
        parsedJson.password &&
        parsedJson.recipient &&
        parsedJson.message
      ) {
        setJsonData(parsedJson)
        setUser({
          username: parsedJson.username,
          password: parsedJson.password,
        })
        setMessage({
          recipient: parsedJson.recipient,
          message: parsedJson.message,
        })
      } else {
        setError('Invalid JSON format: Missing required fields')
        setJsonData(null)
      }
    } catch {
      setError('Invalid JSON format')
      setJsonData(null)
    }
  }

  // Sequential login and send message actions
  const onSubmit = async () => {
    if (!jsonData) {
      setError('Please provide a valid JSON with all required fields')
      return
    }
    try {
      await handleSubmit() // Login
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // setError('Login or message sending failed')
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="json-input" className="text-sm font-medium">
        JSON Input
      </Label>
      <Textarea
        id="json-input"
        placeholder='{"username": "example_username", "password": "password", "recipient": "user", "message": "Hello!"}'
        value={jsonInput}
        onChange={(e) => handleJsonChange(e.target.value)}
        className="w-full min-h-[200px]"
      />

      {jsonData && (
        <div className="mt-4 p-4 border rounded bg-gray-100 space-y-2">
          <h3 className="text-lg font-medium">Preview</h3>
          <div>
            <Label className="text-sm font-medium">Username</Label>
            <input
              type="text"
              value={jsonData.username}
              readOnly
              className="w-full p-2 border rounded bg-white"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Password</Label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={jsonData.password}
                readOnly
                className="w-full p-2 border rounded bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Recipient</Label>
            <input
              type="text"
              value={jsonData.recipient}
              readOnly
              className="w-full p-2 border rounded bg-white"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Message</Label>
            <textarea
              value={jsonData.message}
              readOnly
              className="w-full p-2 border rounded bg-white"
            />
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={onSubmit}
        disabled={!jsonData}
      >
        Submit
      </Button>
    </div>
  )
}
