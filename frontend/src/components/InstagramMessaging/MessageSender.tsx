import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Message } from '../../types'

// Define the props for the MessageSender component
interface MessageSenderProps {
  message: Message // The current message data (recipient and message content)
  setMessage: (message: Message) => void // Function to update message state
  onSendMessage: () => Promise<void> // Function to handle sending the message on form submit
  isLoading: boolean // Boolean indicating if a message is currently being sent
}

// MessageSender component
export function MessageSender({
  message,
  setMessage,
  onSendMessage,
  isLoading,
}: MessageSenderProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault() // Prevent default form submission
        onSendMessage() // Trigger the send message function passed as prop
      }}
      className="space-y-4"
    >
      {/* Recipient Field */}
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-sm font-medium">
          Recipient
        </Label>
        <Input
          id="recipient"
          placeholder="Recipient username"
          value={message.recipient} // Bind to recipient field in message state
          onChange={
            (e) => setMessage({ ...message, recipient: e.target.value }) // Update recipient in message state
          }
          className="w-full"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Your message"
          value={message.message} // Bind to message content in message state
          onChange={(e) => setMessage({ ...message, message: e.target.value })} // Update message content
          className="w-full"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show loading spinner if isLoading is true
        ) : (
          <>Send Message</> // Default text when not loading
        )}
      </Button>
    </form>
  )
}
