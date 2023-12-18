'use client';

import { toast } from '@/hooks';
import { CachedTotalBalance, Exchange, TotalBalance } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { buttonVariants } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface PortfolioDetailsHeaderProps {
  slug: Exchange;
  cachedTotalBalance: CachedTotalBalance;
}

const PortfolioDetailsHeader: FC<PortfolioDetailsHeaderProps> = ({ slug, cachedTotalBalance }) => {
  const [totalBalance, setTotalBalance] = useState<TotalBalance>({ totalFree: 0, totalStaked: 0 });

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
    if (!cachedTotalBalance) {
      getFreeTotalBalance();
    } else {
      const { totalFree, totalStaked } = cachedTotalBalance;

      setTotalBalance({ totalFree: parseInt(totalFree), totalStaked: parseInt(totalStaked) });
    }
  }, [cachedTotalBalance]);

  return (
    <article className="grid grid-cols-[minmax(0,1fr),auto] grid-rows-[1fr,auto]">
      <h1 className="uppercase font-bold mb-4 text-4xl">{slug.toUpperCase()}</h1>

      <div className="mb-4 text-md max-w-[200px]">
        {isLoadingTotalBalance ? (
          <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
        ) : (
          <p className="w-full inline-flex justify-between gap-1">
            <span>Free:</span> <span>${totalBalance.totalFree.toFixed(2)}</span>
          </p>
        )}

        {isLoadingTotalBalance ? (
          <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
        ) : (
          <p className="w-full inline-flex justify-between gap-1">
            <span>Staked:</span> <span>${totalBalance.totalStaked.toFixed(2)}</span>
          </p>
        )}

        {isLoadingTotalBalance && isLoadingTotalBalance ? (
          <Skeleton className="bg-zinc-500 w-[200px] h-[32px] rounded-md" />
        ) : (
          <p className="w-full inline-flex justify-between gap-1 font-semibold text-2xl">
            <span>Total:</span> <span>${(totalBalance.totalFree + totalBalance.totalStaked).toFixed(2)}</span>
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
    </article>
  );
};

export default PortfolioDetailsHeader;
