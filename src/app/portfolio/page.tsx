'use client';

import AssetCard from '@/components/AssetCard';
import { toast } from '@/hooks/use-toast';
import { Balance } from '@/types/user-data/binance-user-data.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const [assets, setAssets] = useState<Balance[]>([]);

  const { mutate: getAssets, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<Balance[]>('/api/portfolio/binance');

      setAssets(data.data);
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
  });

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Portfolio</h2>
      <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>

      <AssetCard exchangeName="Binance" assets={assets} />
    </section>
  );
};

export default Page;
