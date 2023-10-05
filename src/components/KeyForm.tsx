'use client';

import { toast } from '@/hooks/use-toast';
import { CreateApiKeyPayload } from '@/lib/validators/api-key.validator';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { Input } from './ui/input';
import { Label } from './ui/label';

const KeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const router = useRouter();

  const { mutate: setupConnection, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateApiKeyPayload = {
        apiKey,
        apiSecret,
      };

      await axios.post('/api/add-credentials', payload);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          title: error.message,
          description: error.response?.data,
          variant: 'destructive',
        });
      }
    },
    onSuccess: () => {
      router.refresh();
      router.push('/');

      return toast({
        title: 'Connection created successfully!',
        description: 'The connection was successfully created.',
        variant: 'default',
      });
    },
  });

  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
      <div className="text-left">
        <Label>API Key</Label>
        {/* TODO: Add error message */}
        <Input name="api-key" id="api-key" type="text" onChange={(event) => setApiKey(event.target.value)} />
      </div>
      <div className="text-left">
        <Label>API Secret</Label>
        {/* TODO: Add error message */}
        <Input name="api-secret" id="api-secret" type="text" onChange={(event) => setApiSecret(event.target.value)} />
      </div>
      {/* TODO: Add isLoading for Button */}
      <Button
        onClick={() => setupConnection()}
        disabled={apiKey.length === 0 || apiSecret.length === 0}
        type="submit"
        className="w-full"
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Setup API Connection
      </Button>
    </form>
  );
};

export default KeyForm;
