'use client';

import { toast } from '@/hooks/use-toast';
import { RangeTradingPresetPayload } from '@/lib/validators/preset-form.validator';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const RangeTradingPresetForm = () => {
  const [symbol, setSymbol] = useState('');
  const [rangeLow, setRangeLow] = useState('');
  const [rangeHigh, setRangeHigh] = useState('');
  const router = useRouter();

  const {
    mutate: createPreset,
    isLoading,
    data,
  } = useMutation({
    mutationFn: async (payload: RangeTradingPresetPayload) => {
      await axios.post('/api/preset-range', payload);
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
        description: `The Preset Range Trading was successfully created.`,
      });
    },
  });

  const presetConfig: RangeTradingPresetPayload = {
    symbol,
    rangeLow,
    rangeHigh,
  };

  function onSubmit(event: FormEvent<HTMLFormElement>, data: RangeTradingPresetPayload) {
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
        <Label>Lowest Price in USD</Label>
        <Input
          type="number"
          step="any"
          name="rangeLow"
          placeholder="Lowest Price e.g. 35000"
          onChange={(event) => setRangeLow(event.target.value)}
        />
      </div>

      <div>
        <Label>Highest Price in USD</Label>
        <Input
          type="number"
          step="any"
          name="rangeHigh"
          placeholder="Highest Price e.g. 40000"
          onChange={(event) => setRangeHigh(event.target.value)}
        />
      </div>

      <Button type="submit">Set Range Trading</Button>
    </form>
  );
};

export default RangeTradingPresetForm;
