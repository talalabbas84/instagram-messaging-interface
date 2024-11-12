import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import { Message } from '../../types'

// Props for the MessageForm component
interface MessageFormProps {
  message: Message // The message data (recipient and message)
  setMessage: (message: Message) => void // Function to update the message state
  onSendMessage: () => Promise<void> // Function to handle message sending on submit
  isLoading: boolean // Loading state to indicate if message is being sent
  error: string | null // Error message, if any, to display on send failure
}

// MessageForm component
export function MessageForm({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  error,
}: MessageFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault() // Prevent default form submission
        onSendMessage() // Trigger message sending function passed as prop
      }}
      className="space-y-4"
    >
      {/* Display error message if any */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Recipient Input Field */}
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-sm font-medium">
          Recipient
        </Label>
        <Input
          id="recipient"
          placeholder="Instagram username"
          value={message.recipient} // Current recipient value
          onChange={
            (e) => setMessage({ ...message, recipient: e.target.value }) // Update recipient in message state
          }
          className="w-full"
        />
      </div>

      {/* Message Input Field */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Your message"
          value={message.message} // Current message content
          onChange={(e) => setMessage({ ...message, message: e.target.value })} // Update message content
          className="w-full min-h-[100px]"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner if isLoading is true
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </>
        )}
      </Button>
    </form>
  )
}
