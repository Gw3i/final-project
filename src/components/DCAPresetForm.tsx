'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { CreateDCAPresetPayload, DCAPresetValidator } from '@/lib/validators/preset-form.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { INTERVALS } from '../constants/preset-dca.constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DCAPresetForm = () => {
  const router = useRouter();

  const form = useForm<CreateDCAPresetPayload>({
    defaultValues: {
      amount: '',
      interval: '',
      symbolPairLeft: '',
      symbolPairRight: '',
    },
    resolver: zodResolver(DCAPresetValidator),
  });

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

  function onSubmit(data: CreateDCAPresetPayload) {
    createPresetDCA(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-2 grid-cols-2">
          <FormField
            control={form.control}
            name="symbolPairLeft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coin as Symbol to buy</FormLabel>
                <FormControl>
                  <Input placeholder="BTC, ETH..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbolPairRight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency as Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="USD, USDT..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INTERVALS.map((interval) => (
                    <SelectItem key={interval.value} {...((field.value = interval.value), { ...field })}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Set Automation</Button>
      </form>
    </FormProvider>
  );
};

export default DCAPresetForm;
