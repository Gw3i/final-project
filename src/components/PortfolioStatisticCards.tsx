'use client';

import { toast } from '@/hooks';
import { CachedTotalBalance, Exchange, NormalizedBalanceWithCurrentPrice, TotalBalance } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import AssetCard from './AssetCard';

interface PortfolioStatisticsCardsProps {
  slug: Exchange;
  cachedBalance: NormalizedBalanceWithCurrentPrice[] | null;
  cachedTotalBalance: CachedTotalBalance | null;
}

const PortfolioStatisticCards: FC<PortfolioStatisticsCardsProps> = ({ slug, cachedBalance, cachedTotalBalance }) => {
  const [balance, setBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);
  const [totalBalance, setTotalBalance] = useState<TotalBalance>({ totalFree: 0, totalStaked: 0 });

  const { mutate: getTotalBalance, isLoading: isLoadingTotalBalance } = useMutation({
    mutationFn: async () => {
      const url = `/api/portfolio/${slug}/total-balance`;

      const { data } = await axios.get<TotalBalance>(url);

      setTotalBalance(data);
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

  const { mutate: getBalance, isLoading: isBalanceLoading } = useMutation({
    mutationFn: async () => {
      //   const queryString = Object.entries(queryParams ?? {})
      //     .filter(([_, value]) => value)
      //     .map(([key, value]) => `${key}=${value}`)
      //     .join('&');

      const url = `/api/portfolio/${slug}/balance`;
      let fullUrl = url;

      //   if (queryString.length) {
      //     fullUrl = `${url}?${queryString}`;
      //   }

      const data = await axios.get<NormalizedBalanceWithCurrentPrice[]>(fullUrl);

      setBalance(data.data);
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
    if (!cachedBalance) {
      getBalance();
    } else {
      setBalance(cachedBalance);
    }

    if (!cachedTotalBalance) {
      getTotalBalance();
    } else {
      const { totalFree, totalStaked } = cachedTotalBalance;

      setTotalBalance({ totalFree: Number(totalFree), totalStaked: Number(totalStaked) });
    }
  }, [cachedBalance, cachedTotalBalance]);

  const getTop5Assets = () => {
    const sortedBalance = balance.toSorted((a, b) => {
      if (!a.totalPrice || !b.totalPrice) return 0;

      return b.totalPrice - a.totalPrice;
    });

    const top5assets = sortedBalance.slice(0, 5);
    const top5AssetsTotalBalance = top5assets.reduce((accumulator, currentValue) => {
      if (!currentValue.totalPrice) return 0;

      return accumulator + currentValue.totalPrice;
    }, 0);

    return { top5assets, top5AssetsTotalBalance };
  };

  return (
    <article className="grid">
      <AssetCard
        headline="Top 5 assets"
        assets={getTop5Assets().top5assets}
        isLoading={isBalanceLoading ?? false}
        isBalanceVisible={true}
        totalBalance={getTop5Assets().top5AssetsTotalBalance}
      />

      <AssetCard
        headline="All assets"
        assets={balance}
        isLoading={isBalanceLoading ?? false}
        isBalanceVisible={true}
        totalBalance={totalBalance.totalFree}
      />
    </article>
  );
};

export default PortfolioStatisticCards;
