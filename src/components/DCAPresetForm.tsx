'use client';

import { Button } from '@/components/ui/Button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CreateDCAPresetPayload, DCAPresetValidator } from '@/lib/validators/preset-form.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DCAPresetForm = () => {
  const router = useRouter();

  const form = useForm<CreateDCAPresetPayload>({
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
        description: 'The Preset DCA was successfully created.',
      });
    },
  });

  const intervals = [
    { label: '1 Hour', value: '1h' },
    { label: '12 Hours', value: '12h' },
    { label: '1 Day', value: '1d' },
    { label: '1 Week', value: '1w' },
    { label: '1 Month', value: '1m' },
    { label: '2 Months', value: '2m' },
    { label: '3 Months', value: '3m' },
  ] as const;

  function onSubmit(data: CreateDCAPresetPayload) {
    createPresetDCA(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input placeholder="Cryptocurrency symbol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date (optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(startDate: Date) => startDate < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>If no Start Date is selected, the automation will start in 1 hour.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(endDate: Date) => endDate < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                If no End Date is selected, the automation will run for 1 year or until you stop it.
              </FormDescription>
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
