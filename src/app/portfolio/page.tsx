'use client';

import AssetCard from '@/components/AssetCard';
import ExchangeCard from '@/components/ExchangeCard';
import { BalanceVisibilityContext } from '@/components/Providers';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTotalBalance } from '@/hooks';
import { useGetAssetBalance } from '@/hooks/use-get-asset-balance';
import { CreateBaseQueryParams } from '@/lib/validators/query-params.validator';
import { useContext } from 'react';

const Page = () => {
  const { isBalanceVisible } = useContext(BalanceVisibilityContext);

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
  const { totalBalance: krakenTotalBalance, isLoading: isKrakenTotalBalanceLoading } = useGetTotalBalance({
    exchange: 'kraken',
  });
  const { totalBalance: binanceTotalBalance, isLoading: isBinanceTotalBalanceLoading } = useGetTotalBalance({
    exchange: 'binance',
  });

  return (
    <section className="grid mx-auto mt-8">
      <div className="grid grid-cols-[1fr,auto] items-start">
        <div>
          <h2 className="text-headline-small mb-4">Portfolio</h2>
          <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>
        </div>

        <div className="flex gap-1 items-center">
          {isKrakenTotalBalanceLoading || isBinanceTotalBalanceLoading ? (
            <Skeleton className="bg-zinc-500 w-[100px] h-[32px] rounded-md mb-4" />
          ) : (
            <p className="uppercase font-semibold mb-4 text-2xl">
              $
              {isBalanceVisible
                ? Number(krakenTotalBalance.totalFree + binanceTotalBalance.totalFree).toFixed(2)
                : '*******'}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        {/* TODO: Loop trough all exchanges in DB */}
        <ExchangeCard
          exchange="binance"
          totalBalance={binanceTotalBalance.totalFree}
          isLoading={isLoadingBinanceBalance}
        />
        <AssetCard
          exchangeName="Binance"
          assets={binanceBalance}
          isLoading={isLoadingBinanceBalance}
          isBalanceVisible={isBalanceVisible}
          totalBalance={binanceTotalBalance.totalFree}
          hasLink
        />
        <AssetCard
          exchangeName="Kraken"
          assets={krakenBalance}
          isLoading={isLoadingKrakenBalance}
          isBalanceVisible={isBalanceVisible}
          totalBalance={krakenTotalBalance.totalFree}
          hasLink
        />
      </div>
    </section>
  );
};

export default Page;
