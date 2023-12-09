'use client';

import AssetCard from '@/components/AssetCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { NormalizedBalanceWithCurrentPrice } from '@/types/user-data/balance.types';
import { KrakenSortedBalance } from '@/types/user-data/kraken-user-data.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const [binanceAssets, setBinanceAssets] = useState<NormalizedBalanceWithCurrentPrice[]>([]);
  const [krakenAssets, setKrakenAssets] = useState<KrakenSortedBalance | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const { mutate: getBinanceAssets, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<NormalizedBalanceWithCurrentPrice[]>('/api/portfolio/binance');

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
      const data = await axios.get<KrakenSortedBalance>('/api/portfolio/kraken?sortBy=value');

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

  // TODO: Balance is not showing right because BinanceAssets rerendering twice
  const getTotal = (newBalance: number) => {
    setTotalBalance((prevTotalBalance) => {
      return prevTotalBalance + newBalance;
    });
  };

  useEffect(() => {
    getBinanceAssets();
    getKrakenAssets();
  }, []);

  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <div className="grid grid-cols-[1fr,auto] items-start">
        <div>
          <h2 className="text-headline-small mb-4">Portfolio</h2>
          <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>
        </div>

        <div className="flex gap-1 items-center">
          <Button className="-mt-4" variant="ghost" onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
            {isBalanceVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
          <p className="uppercase font-semibold mb-4 text-2xl">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <AssetCard
          exchangeName="Binance"
          assets={binanceAssets}
          isLoading={isLoading}
          isBalanceVisible={isBalanceVisible}
          handleTotalBalance={getTotal}
        />
        <AssetCard
          exchangeName="Kraken"
          assets={krakenAssets?.freeAssets ?? []}
          isLoading={isKrakenAssetsLoading}
          isBalanceVisible={isBalanceVisible}
          handleTotalBalance={getTotal}
        />
      </div>
    </section>
  );
};

export default Page;
