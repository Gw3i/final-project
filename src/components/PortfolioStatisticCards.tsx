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
  cachedStakedBalance: NormalizedBalanceWithCurrentPrice[] | null;
  cachedTotalBalance: CachedTotalBalance | null;
}

const PortfolioStatisticCards: FC<PortfolioStatisticsCardsProps> = ({
  slug,
  cachedBalance,
  cachedTotalBalance,
  cachedStakedBalance,
}) => {
  const [balance, setBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);
  const [stakedBalance, setStakedBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);
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
      const url = `/api/portfolio/${slug}/balance`;

      const { data } = await axios.get<NormalizedBalanceWithCurrentPrice[]>(url);

      setBalance(data);
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

  const { mutate: getStakedBalance, isLoading: isStakedBalanceLoading } = useMutation({
    mutationFn: async () => {
      const url = `/api/portfolio/${slug}/balance?staked=true`;

      const { data } = await axios.get<NormalizedBalanceWithCurrentPrice[]>(url);

      setStakedBalance(data);
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
  }, [cachedBalance, getBalance]);

  useEffect(() => {
    if (!cachedStakedBalance) {
      getStakedBalance();
    } else {
      setStakedBalance(cachedStakedBalance);
    }
  }, [cachedStakedBalance, getStakedBalance]);

  useEffect(() => {
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

  console.log({ cachedStakedBalance, stakedBalance });

  return (
    <article className="grid lg:grid-cols-2 gap-4">
      <AssetCard
        headline="Top 5 assets"
        assets={getTop5Assets().top5assets}
        isLoading={isBalanceLoading ?? false}
        isBalanceVisible={true}
        totalBalance={getTop5Assets().top5AssetsTotalBalance}
      />

      <AssetCard
        headline="Don't know yet"
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

      {stakedBalance.length > 0 && (
        <AssetCard
          headline="Staked assets"
          assets={stakedBalance}
          isLoading={isStakedBalanceLoading ?? false}
          isBalanceVisible={true}
          totalBalance={totalBalance.totalStaked}
        />
      )}
    </article>
  );
};

export default PortfolioStatisticCards;
