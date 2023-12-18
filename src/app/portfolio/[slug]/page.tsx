import PortfolioDetailsHeader from '@/components/PortfolioDetailsHeader';
import PortfolioStatisticsCards from '@/components/PortfolioStatisticsCards';
import { redis } from '@/lib/redis';
import { CachedTotalBalance, Exchange, NormalizedBalanceWithCurrentPrice } from '@/types';

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

  const cachedBalance = (await redis.hgetall(`balance:${slug}`)) as {
    balance: NormalizedBalanceWithCurrentPrice[];
  } | null;
  const cachedTotalBalance = (await redis.hgetall(`totalBalance:${slug}`)) as CachedTotalBalance | null;

  return (
    <section>
      {cachedTotalBalance && <PortfolioDetailsHeader slug={slug} cachedTotalBalance={cachedTotalBalance} />}

      <PortfolioStatisticsCards
        slug={slug}
        cachedTotalBalance={cachedTotalBalance}
        cachedBalance={cachedBalance?.balance ?? null}
      />
    </section>
  );
};

export default Page;
