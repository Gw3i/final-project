import AddKey from '@/components/AddKey';
import PortfolioCard from '@/components/PortfolioCard';
import TickersTable from '@/components/TickersTable';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Exchange } from '@/types';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getAuthSession();

  const secrets = await db.secret.findMany();

  const exchanges = secrets.map((s) => s.exchange as Exchange);

  if (!session?.user) redirect('/sign-in');

  // const cachedBalance = (await redis.hgetall(`balance:${slug}`)) as {
  //   freeAssets: NormalizedBalanceWithCurrentPrice[];
  //   stakedAssets: NormalizedBalanceWithCurrentPrice[];
  // } | null;

  // const cachedTotalBalance = (await redis.hgetall(`totalBalance:${slug}`)) as CachedTotalBalance | null;

  return (
    <>
      <div className="grid gap-8 mt-8">
        {secrets.length > 0 && <PortfolioCard exchanges={exchanges} />}

        {secrets.length === 0 && <AddKey />}

        <section className="overflow-hidden">
          <h2 className="text-headline-small mb-4">Ticker</h2>
          <TickersTable />
        </section>
      </div>
    </>
  );
}
