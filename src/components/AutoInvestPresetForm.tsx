'use client';

import { toast } from '@/hooks/use-toast';
import { PresetAutoInvestPayload } from '@/lib/validators/preset-form.validator';
import { SubscriptionCycle } from '@/types/binance/order.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { INTERVALS } from '../constants/preset-dca.constants';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const AutoInvestPresetForm = () => {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState<SubscriptionCycle>('MONTHLY');
  const router = useRouter();

  const {
    mutate: createPreset,
    isLoading,
    data,
  } = useMutation({
    mutationFn: async (payload: PresetAutoInvestPayload) => {
      await axios.post('/api/preset-auto-invest', payload);
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

  const presetConfig: PresetAutoInvestPayload = {
    amount,
    interval,
    symbol,
  };

  function onSubmit(event: FormEvent<HTMLFormElement>, data: PresetAutoInvestPayload) {
    event.preventDefault();
    createPreset(data);
  }

  return (
    <form onSubmit={(event) => onSubmit(event, presetConfig)} className="space-y-8">
      <div className="grid gap-2 grid-cols-2">
        <div>
          <Label htmlFor="symbol">Coin</Label>
          <Input
            type="string"
            name="symbol"
            placeholder="BTC, ETH..."
            onChange={(event) => setSymbol(event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          step="any"
          name="amount"
          placeholder="Amount"
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div>
        <Label>Interval</Label>
        <Select onValueChange={(value) => setInterval(value as SubscriptionCycle)}>
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
      </div>

      <Button type="submit">Set Automation</Button>
    </form>
  );
};

export default AutoInvestPresetForm;
