'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect } from 'react';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const { mutate: getBalance, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.get('/api/portfolio/binance');
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
      //   return toast({
      //     title: 'Connection created successfully!',
      //     description: 'The connection was successfully created.',
      //     variant: 'default',
      //   });
    },
  });

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Portfolio</h2>
      <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Binance</AccordionTrigger>
          <AccordionContent>Binance assets table</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Kraken</AccordionTrigger>
          <AccordionContent>Empty for now</AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Page;
