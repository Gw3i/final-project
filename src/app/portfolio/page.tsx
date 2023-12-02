'use client';

import AssetCard from '@/components/AssetCard';
import { toast } from '@/hooks/use-toast';
import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenSortedBalance } from '@/types/user-data/kraken-user-data.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const [binanceAssets, setBinanceAssets] = useState<BinanceBalance[]>([]);
  const [krakenAssets, setKrakenAssets] = useState<KrakenSortedBalance | null>(null);

  const { mutate: getBinanceAssets, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<BinanceBalance[]>('/api/portfolio/binance');

      setBinanceAssets(data.data);
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

  const { mutate: getKrakenAssets, isLoading: isKrakenAssetsLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<KrakenSortedBalance>('/api/portfolio/kraken');

      setKrakenAssets(data.data);
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
    getBinanceAssets();
    getKrakenAssets();
  }, []);

  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Portfolio</h2>
      <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>

      <div className="grid gap-4">
        <AssetCard exchangeName="Binance" assets={binanceAssets} isLoading={isLoading} />
        <AssetCard exchangeName="Kraken" assets={krakenAssets?.freeAssets ?? []} isLoading={isKrakenAssetsLoading} />
      </div>
    </section>
  );
};

export default Page;
