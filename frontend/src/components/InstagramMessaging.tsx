// components/InstagramMessaging.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useSession } from '../hooks/useSession';
import { Message, User } from '../types/types';
import { JsonInputForm } from './JsonInputForm';
import { LoginForm } from './LoginForm';
import { MessageForm } from './MessageForm';

export default function InstagramMessaging() {
  const { isLoggedIn, user, login, logout, setUser } = useSession();
  const [message, setMessage] = useState<Message>({
    recipient: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'json'>('manual');

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    if (!user.username || !user.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    // Simulate successful login
    await new Promise(resolve => setTimeout(resolve, 1500));
    login(user);
    setSuccess('Logged in successfully!');
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    setError(null);
    if (!message.recipient || !message.message) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(`Message sent to ${message.recipient}!`);
    setMessage({ recipient: '', message: '' });
    setIsLoading(false);
  };

  const handleJsonChange = (input: string) => {
    setJsonInput(input);
    setError(null);
    try {
      const parsedJson: User & Message = JSON.parse(input);
      setUser({ username: parsedJson.username, password: parsedJson.password });
      setMessage({
        recipient: parsedJson.recipient,
        message: parsedJson.message
      });
    } catch {
      setError('Invalid JSON format');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Instagram Messaging
          </CardTitle>
          <CardDescription className='text-center'>
            Send messages via Instagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && <p className='text-green-600 text-center'>{success}</p>}
          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as 'manual' | 'json')}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-4'>
              <TabsTrigger value='manual'>Manual Input</TabsTrigger>
              <TabsTrigger value='json'>JSON Input</TabsTrigger>
            </TabsList>
            <TabsContent value='manual'>
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
            <TabsContent value='json'>
              <JsonInputForm
                jsonInput={jsonInput}
                setJsonInput={handleJsonChange}
                error={error}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {isLoggedIn && (
            <Button variant='outline' onClick={logout} className='w-full'>
              Logout
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
