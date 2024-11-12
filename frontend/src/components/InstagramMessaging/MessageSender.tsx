import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Message } from '../../types'

interface MessageSenderProps {
  message: Message
  setMessage: (message: Message) => void
  onSendMessage: () => Promise<void>
  isLoading: boolean
}

export function MessageSender({
  message,
  setMessage,
  onSendMessage,
  isLoading,
}: MessageSenderProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSendMessage()
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-sm font-medium">
          Recipient
        </Label>
        <Input
          id="recipient"
          placeholder="Recipient username"
          value={message.recipient}
          onChange={(e) =>
            setMessage({ ...message, recipient: e.target.value })
          }
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Your message"
          value={message.message}
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>Send Message</>
        )}
      </Button>
    </form>
  )
}
