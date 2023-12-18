import PortfolioDetailsHeader from '@/components/PortfolioDetailsHeader';
import { redis } from '@/lib/redis';
import { CachedTotalBalance, Exchange, KrakenSortedBalance } from '@/types';

interface PageProps {
  params: {
    slug: Exchange;
  };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const Page = async ({ params }: PageProps) => {
  // TODO: Add skeleton
  // TODO: Cache totalBalances and balance

  const { slug } = params;

  const cachedBalance = (await redis.hgetall(`balance:${slug}`)) as KrakenSortedBalance | null;
  const cachedTotalBalance = (await redis.hgetall(`totalBalance:${slug}`)) as CachedTotalBalance | null;

  return (
    <section>
      {cachedTotalBalance && <PortfolioDetailsHeader slug={slug} cachedTotalBalance={cachedTotalBalance} />}

      {/* <div className="grid">
        <AssetCard
          headline="All assets"
          assets={balance}
          isLoading={isLoading}
          isBalanceVisible={true}
          totalBalance={totalBalance}
        />
      </div> */}
    </section>
  );
};

export default Page;
