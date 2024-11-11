import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface JsonInputFormProps {
  jsonInput: string
  setJsonInput: (input: string) => void
  setUser: (user: { username: string; password: string }) => void
  setMessage: (message: { recipient: string; message: string }) => void
  handleSubmit: () => void
  error: string | null
}

export function JsonInputForm({
  jsonInput,
  setJsonInput,
  setUser,
  setMessage,
  handleSubmit,
}: JsonInputFormProps) {
  const [localError, setLocalError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jsonData, setJsonData] = useState<any>(null)

  const handleJsonChange = (input: string) => {
    setJsonInput(input)
    setLocalError(null)

    try {
      // Parse the JSON input
      const parsedJson = JSON.parse(input)

      // Validate if all necessary fields are present
      if (
        parsedJson.username &&
        parsedJson.password &&
        parsedJson.recipient &&
        parsedJson.message
      ) {
        // Set parsed data into local state
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
        setLocalError('Invalid JSON format: Missing required fields')
      }
    } catch {
      setLocalError('Invalid JSON format')
    }
  }

  return (
    <div className="space-y-2">
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
      {localError && <p className="text-red-500 text-sm">{localError}</p>}

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

      {/* Display populated fields below the JSON input */}
      {jsonData && (
        <div className="mt-4">
          <div className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Username</Label>
              <input
                type="text"
                value={jsonData.username}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Password</Label>
              <input
                type="password"
                value={jsonData.password}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Recipient</Label>
              <input
                type="text"
                value={jsonData.recipient}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Message</Label>
              <textarea
                value={jsonData.message}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={handleSubmit} // Handle form submission
      >
        Submit
      </Button>
    </div>
  )
}
