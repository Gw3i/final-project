'use client';

import AssetCard from '@/components/AssetCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTotalBalance } from '@/hooks';
import { useGetAssetBalance } from '@/hooks/use-get-asset-balance';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

const Page = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const { balance: krakenBalance, isLoading: isLoadingKrakenBalance } = useGetAssetBalance('kraken');
  const { balance: binanceBalance, isLoading: isLoadingBinanceBalance } = useGetAssetBalance('binance');
  const { totalBalance: krakenTotalBalance, isLoading: isKrakenTotalBalanceLoading } = useGetTotalBalance('kraken');
  const { totalBalance: binanceTotalBalance, isLoading: isBinanceTotalBalanceLoading } = useGetTotalBalance('binance');

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

          {isKrakenTotalBalanceLoading || isBinanceTotalBalanceLoading ? (
            <Skeleton className="bg-zinc-500 w-[100px] h-[32px] rounded-md mb-4" />
          ) : (
            <p className="uppercase font-semibold mb-4 text-2xl">
              ${isBalanceVisible ? (krakenTotalBalance + binanceTotalBalance).toFixed(2) : '*******'}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <AssetCard
          exchangeName="Binance"
          assets={binanceBalance}
          isLoading={isLoadingKrakenBalance}
          isBalanceVisible={isBalanceVisible}
          totalBalance={binanceTotalBalance}
        />
        <AssetCard
          exchangeName="Kraken"
          assets={krakenBalance}
          isLoading={isLoadingBinanceBalance}
          isBalanceVisible={isBalanceVisible}
          totalBalance={krakenTotalBalance}
        />
      </div>
    </section>
  );
};

export default Page;
