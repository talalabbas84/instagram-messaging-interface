// components/MessageForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Message } from '../types/types';

interface MessageFormProps {
  message: Message;
  setMessage: (message: Message) => void;
  onSendMessage: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function MessageForm({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  error
}: MessageFormProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSendMessage();
      }}
      className='space-y-4'
    >
      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <div className='space-y-2'>
        <Label htmlFor='recipient' className='text-sm font-medium'>
          Recipient
        </Label>
        <Input
          id='recipient'
          placeholder='Instagram username'
          value={message.recipient}
          onChange={e => setMessage({ ...message, recipient: e.target.value })}
          className='w-full'
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='message' className='text-sm font-medium'>
          Message
        </Label>
        <Textarea
          id='message'
          placeholder='Your message'
          value={message.message}
          onChange={e => setMessage({ ...message, message: e.target.value })}
          className='w-full min-h-[100px]'
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <>
            <Send className='mr-2 h-4 w-4' /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}
