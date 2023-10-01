'use client';

import { ApiKeyValidatorSchema } from '@/lib/validators/api-key.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/Form';
import { Input } from './ui/Input';

interface KeyFormProps {}

const KeyForm: FC<KeyFormProps> = ({}) => {
  const form = useForm<z.infer<typeof ApiKeyValidatorSchema>>({
    resolver: zodResolver(ApiKeyValidatorSchema),
    defaultValues: {
      apiKey: '',
    },
  });

  function onSubmit(values: z.infer<typeof ApiKeyValidatorSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="exampleKey123######" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create API Key
        </Button>
      </form>
    </Form>
  );
};

export default KeyForm;
