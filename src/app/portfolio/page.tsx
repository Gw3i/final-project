'use client';

import AssetCard from '@/components/AssetCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTotalBalance } from '@/hooks';
import { useGetAssetBalance } from '@/hooks/use-get-asset-balance';
import { CreateBaseQueryParams } from '@/lib/validators/query-params.validator';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

const Page = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // TODO: Add cache when assets were loaded once
  // TODO: Move balance visibility to as Context

  const assetBalanceQueryParams: CreateBaseQueryParams = {
    page: '1',
    limit: '5',
    sortBy: 'value',
    sortOrder: 'desc',
    staked: false,
  };

  const { balance: krakenBalance, isLoading: isLoadingKrakenBalance } = useGetAssetBalance({
    exchange: 'kraken',
    queryParams: assetBalanceQueryParams,
  });
  const { balance: binanceBalance, isLoading: isLoadingBinanceBalance } = useGetAssetBalance({
    exchange: 'binance',
    queryParams: assetBalanceQueryParams,
  });
  const { totalBalance: krakenTotalBalance, isLoading: isKrakenTotalBalanceLoading } = useGetTotalBalance({exchange:'kraken'});
  const { totalBalance: binanceTotalBalance, isLoading: isBinanceTotalBalanceLoading } = useGetTotalBalance({exchange:'binance'});

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
