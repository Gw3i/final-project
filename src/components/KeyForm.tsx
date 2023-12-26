'use client';

import { toast } from '@/hooks/use-toast';
import { CreateApiKeyPayload } from '@/lib/validators/api-key.validator';
import { Exchange } from '@/types/exchanges/exchange';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Exchanges {
  label: string;
  value: Exchange;
}

const KeyForm = () => {
  const [exchange, setExchange] = useState('binance');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const router = useRouter();

  const exchanges: Exchanges[] = [
    { label: 'Binance', value: 'binance' },
    { label: 'Kraken', value: 'kraken' },
  ];

  const { mutate: setupConnection, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateApiKeyPayload = {
        exchange,
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
      <div className="w-full text-left">
        <Select onValueChange={setExchange} defaultValue={exchange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an exchange" />
          </SelectTrigger>
          <SelectContent>
            {exchanges.map((exchange) => (
              <SelectItem key={exchange.value} value={exchange.value}>
                {exchange.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {exchange && (
          <Button asChild variant="link">
            <Link
              className="flex items-center gap-[2px] text-xs"
              target="_blank"
              href={
                exchange === 'binance'
                  ? 'https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072'
                  : 'https://support.kraken.com/hc/en-us/articles/360000919966-How-to-create-an-API-key'
              }
            >
              <span>
                How to generate a <span className="inline-block first-letter:uppercase">{exchange}</span> API Key
              </span>
              <MoveUpRight width={16} height={16} />
            </Link>
          </Button>
        )}
      </div>

      <div className="text-left">
        <Label>API Key</Label>
        <Input name="api-key" id="api-key" type="text" onChange={(event) => setApiKey(event.target.value)} />
      </div>
      <div className="text-left">
        <Label>API Secret</Label>
        <Input name="api-secret" id="api-secret" type="text" onChange={(event) => setApiSecret(event.target.value)} />
      </div>
      {/* TODO: Add isLoading for Button */}
      <Button
        onClick={() => setupConnection()}
        disabled={apiKey.length === 0 || apiSecret.length === 0}
        type="submit"
        className="w-full"
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Add Exchange
      </Button>
    </form>
  );
};

export default KeyForm;
