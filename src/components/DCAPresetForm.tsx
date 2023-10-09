'use client';

import { toast } from '@/hooks/use-toast';
import { CreateDCAPresetPayload } from '@/lib/validators/preset-form.validator';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { INTERVALS } from '../constants/preset-dca.constants';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DCAPresetForm = () => {
  const [symbolPairLeft, setSymbolPairLeft] = useState('');
  const [symbolPairRight, setSymbolPairRight] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('');
  const router = useRouter();

  const { mutate: createPresetDCA, isLoading } = useMutation({
    mutationFn: async (payload: CreateDCAPresetPayload) => {
      await axios.post('/api/preset-dca', payload);
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
      router.push('/');

      return toast({
        title: 'Preset created successfully!',
        description: `The Preset DCA was successfully created.`,
      });
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>, data: CreateDCAPresetPayload) {
    event.preventDefault();
    createPresetDCA(data);
  }

  return (
    <form
      onSubmit={(event) => onSubmit(event, { amount, interval, symbolPairLeft, symbolPairRight })}
      className="space-y-8"
    >
      <div className="grid gap-2 grid-cols-2">
        <div>
          <Label htmlFor="symbolPairLeft">Coin as Symbol to buy</Label>
          <Input
            type="string"
            name="symbolPairLeft"
            placeholder="BTC, ETH..."
            onChange={(event) => setSymbolPairLeft(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="symbolPairRight">Currency as Symbol</Label>
          <Input
            name="symbolPairRight"
            type="string"
            placeholder="USD, USDT..."
            onChange={(event) => setSymbolPairRight(event.target.value)}
          />
        </div>
      </div>

      <Label>Amount</Label>

      <Input type="number" name="amount" placeholder="Amount" onChange={(event) => setAmount(event.target.value)} />

      <Label>Interval</Label>
      <Select onValueChange={setInterval}>
        <SelectTrigger>
          <SelectValue placeholder="Select an interval" />
        </SelectTrigger>

        <SelectContent>
          {INTERVALS.map((interval) => (
            <SelectItem key={interval.value} value={interval.value}>
              {interval.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit">Set Automation</Button>
    </form>
  );
};

export default DCAPresetForm;
