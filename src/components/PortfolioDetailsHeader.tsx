'use client';

import { toast } from '@/hooks';
import { CachedTotalBalance, Exchange, NormalizedBalanceWithCurrentPrice, TotalBalance } from '@/types';
import { PieChartData } from '@/types/pie-chart/pie-chart.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { FC, useContext, useEffect, useState } from 'react';
import PieChart from './PieChart';
import { BalanceVisibilityContext } from './Providers';
import { buttonVariants } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface PortfolioDetailsHeaderProps {
  slug: Exchange;
  cachedTotalBalance: CachedTotalBalance | null;
  cachedBalance: NormalizedBalanceWithCurrentPrice[] | null;
}

const PortfolioDetailsHeader: FC<PortfolioDetailsHeaderProps> = ({ slug, cachedBalance, cachedTotalBalance }) => {
  const { isBalanceVisible } = useContext(BalanceVisibilityContext);
  const [balance, setBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);
  const [totalBalance, setTotalBalance] = useState<TotalBalance>({ totalFree: 0, totalStaked: 0 });

  const pieChartAllocationData: PieChartData[] = [
    { id: 'Free', value: Number(totalBalance.totalFree.toFixed(2)) },
    { id: 'Staked', value: Number(totalBalance.totalStaked.toFixed(2)) },
  ];

  const pieChartBalanceData: PieChartData[] = balance.map((asset) => ({
    id: asset.name,
    value: Number(asset.totalPrice?.toFixed(2)),
  }));

  const calculateAllocationChartData = pieChartAllocationData.map((allocation) => {
    let data: PieChartData = { id: '', value: 0 };

    if (!isBalanceVisible) {
      data = { id: allocation.id, value: 1111 };
    } else {
      data = allocation;
    }

    return data;
  });

  const calculateBalanceData = pieChartBalanceData.map((asset) => {
    let data: PieChartData = { id: '', value: 0 };

    if (!isBalanceVisible) {
      data = { id: asset.id, value: 1 };
    } else {
      data = asset;
    }

    return data;
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

  const { mutate: getFreeTotalBalance, isLoading: isLoadingTotalBalance } = useMutation({
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

  useEffect(() => {
    if (!cachedBalance) {
      getBalance();
    } else {
      setBalance(cachedBalance);
    }
  }, [cachedBalance, getBalance]);

  useEffect(() => {
    if (!cachedTotalBalance) {
      getFreeTotalBalance();
    } else {
      const { totalFree, totalStaked } = cachedTotalBalance;

      setTotalBalance({ totalFree: Number(totalFree), totalStaked: Number(totalStaked) });
    }
  }, [cachedTotalBalance]);

  return (
    <article>
      <div className="grid grid-cols-[minmax(0,1fr),auto] grid-rows-[1fr,auto] -m-4 mb-2 px-4 pt-4 bg-zinc-100">
        <h1 className="uppercase font-bold mb-4 text-4xl">{slug.toUpperCase()}</h1>

        <div className="mb-4 text-md max-w-[200px]">
          {isLoadingTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1">
              <span>Free:</span>{' '}
              {isBalanceVisible ? <span>${totalBalance.totalFree.toFixed(2)}</span> : <span>*******</span>}
            </p>
          )}

          {isLoadingTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1">
              <span>Staked:</span>{' '}
              {isBalanceVisible ? <span>${totalBalance.totalStaked.toFixed(2)}</span> : <span>*******</span>}
            </p>
          )}

          {isLoadingTotalBalance && isLoadingTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[32px] rounded-md" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1 font-semibold text-2xl">
              <span>Total:</span>{' '}
              {isBalanceVisible ? (
                <span>${(totalBalance.totalFree + totalBalance.totalStaked).toFixed(2)}</span>
              ) : (
                <span>$******</span>
              )}
            </p>
          )}
        </div>

        <Link
          href={`https://${slug}.com`}
          target="_blank"
          title={`Create new order on ${slug}`}
          className={buttonVariants({ variant: 'default' }) + 'col-start-2 col-end-3 row-start-1'}
        >
          <span className="mr-2">New order</span> <ExternalLink />
        </Link>
      </div>

      <div className="mt-4 sm:grid sm:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <div>
          <h2 className="uppercase font-bold text-xl text-zinc-600">Allocation</h2>
          <p className="text-zinc-400 text-sm">in $</p>
          <div className="w-full h-[300px]">
            <PieChart data={calculateAllocationChartData} colorScheme="paired" />
          </div>
        </div>

        <div>
          <h2 className="uppercase font-bold text-xl text-zinc-600">Free assets</h2>
          <p className="text-zinc-400 text-sm">in $</p>

          <div className="w-full h-[300px]">
            <PieChart data={calculateBalanceData} colorScheme="green_blue" showLegend={false} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PortfolioDetailsHeader;
