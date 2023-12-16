'use client';

import AssetCard from '@/components/AssetCard';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTotalBalance } from '@/hooks';
import { useGetAssetBalance } from '@/hooks/use-get-asset-balance';
import { Exchange } from '@/types';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  params: {
    slug: Exchange;
  };
}

const Page = ({ params }: PageProps) => {
  // TODO: Add skeleton
  // TODO: Cache totalBalances and balance

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const { slug } = params;

  const { balance, isLoading } = useGetAssetBalance({ exchange: slug });
  const { totalBalance, isLoading: isLoadingTotalBalance } = useGetTotalBalance({ exchange: slug });
  const { totalBalance: stakedTotalBalance, isLoading: isLoadingStakedTotalBalance } = useGetTotalBalance({
    exchange: slug,
    staked: true,
  });

  return (
    <section>
      <article className="grid grid-cols-[minmax(0,1fr),auto] grid-rows-[1fr,auto]">
        <h1 className="uppercase font-bold mb-4 text-4xl">{slug.toUpperCase()}</h1>

        <div className="mb-4 text-md max-w-[200px]">
          {isLoadingTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1">
              <span>Free:</span> <span>${totalBalance.toFixed(2)}</span>
            </p>
          )}

          {isLoadingStakedTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[22px] rounded-md mb-[2px]" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1">
              <span>Staked:</span> <span>${stakedTotalBalance.toFixed(2)}</span>
            </p>
          )}

          {isLoadingTotalBalance && isLoadingStakedTotalBalance ? (
            <Skeleton className="bg-zinc-500 w-[200px] h-[32px] rounded-md" />
          ) : (
            <p className="w-full inline-flex justify-between gap-1 font-semibold text-2xl">
              <span>Total:</span> <span>${(totalBalance + stakedTotalBalance).toFixed(2)}</span>
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

      <div className="grid">
        <AssetCard
          headline="All assets"
          assets={balance}
          isLoading={isLoading}
          isBalanceVisible={isBalanceVisible}
          totalBalance={totalBalance}
        />
      </div>
    </section>
  );
};

export default Page;
