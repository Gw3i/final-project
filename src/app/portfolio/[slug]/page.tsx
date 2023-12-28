import PortfolioDetailsHeader from '@/components/PortfolioDetailsHeader';
import PortfolioStatisticCards from '@/components/PortfolioStatisticCards';
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
  const { slug } = params;

  const cachedBalance = (await redis.hgetall(`balance:${slug}`)) as {
    freeAssets: NormalizedBalanceWithCurrentPrice[];
    stakedAssets: NormalizedBalanceWithCurrentPrice[];
  } | null;

  const cachedTotalBalance = (await redis.hgetall(`totalBalance:${slug}`)) as CachedTotalBalance | null;

  return (
    <section>
      {cachedTotalBalance && (
        <PortfolioDetailsHeader
          slug={slug}
          cachedTotalBalance={cachedTotalBalance}
          cachedBalance={cachedBalance?.freeAssets ?? null}
        />
      )}

      <PortfolioStatisticCards
        slug={slug}
        cachedTotalBalance={cachedTotalBalance}
        cachedBalance={cachedBalance?.freeAssets ?? null}
        cachedStakedBalance={cachedBalance?.stakedAssets ?? null}
      />
    </section>
  );
};

export default Page;
