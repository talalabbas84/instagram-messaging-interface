import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

// Interface defining the structure of the JSON data
export interface JsonData {
  username: string
  password: string
  recipient: string
  message: string
}

// Interface for the props passed to the component
interface JsonInputFormProps {
  jsonInput: string
  setJsonInput: (input: string) => void
  jsonData: JsonData | null
  setJsonData: (data: JsonData | null) => void
  setUser: (user: { username: string; password: string }) => void
  setMessage: (message: { recipient: string; message: string }) => void
  handleSubmit: () => Promise<void>
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

  // Handle changes in the JSON input field and validate the JSON structure
  const handleJsonChange = (input: string) => {
    setJsonInput(input)
    setError('') // Clear any previous error messages
    try {
      const parsedJson: JsonData = JSON.parse(input) // Attempt to parse JSON
      // Ensure all required fields are present
      if (
        parsedJson.username &&
        parsedJson.password &&
        parsedJson.recipient &&
        parsedJson.message
      ) {
        // If valid, update the state with parsed JSON data
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
        // Display error if required fields are missing
        setError('Invalid JSON format: Missing required fields')
        setJsonData(null)
      }
    } catch {
      // Handle invalid JSON format
      setError('Invalid JSON format')
      setJsonData(null)
    }
  }

  // Handle submission of the form, which performs login and sends message
  const onSubmit = async () => {
    if (!jsonData) {
      setError('Please provide a valid JSON with all required fields')
      return
    }
    try {
      await handleSubmit() // Login
    } catch {
      console.log('Error occurred during login')
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

      {/* Display parsed JSON data as a preview */}
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

      {/* Submit button to trigger login and message sending */}
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
