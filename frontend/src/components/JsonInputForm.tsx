// components/JsonInputForm.tsx
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JsonInputFormProps {
  jsonInput: string;
  setJsonInput: (input: string) => void;
  error: string | null;
}

export function JsonInputForm({
  jsonInput,
  setJsonInput,
  error
}: JsonInputFormProps) {
  return (
    <div className='space-y-2'>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <Label htmlFor='json-input' className='text-sm font-medium'>
        JSON Input
      </Label>
      <Textarea
        id='json-input'
        placeholder='{"username": "example_username", "password": "password", "recipient": "user", "message": "Hello!"}'
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
        className='w-full min-h-[200px]'
      />
    </div>
  );
}
