import AddKey from '@/components/AddKey';
import PortfolioCard from '@/components/PortfolioCard';
import TickersTable from '@/components/TickersTable';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Exchange } from '@/types';

export default async function Home() {
  const session = await getAuthSession();

  const secrets = await db.secret.findMany();

  const exchanges = secrets.map((s) => s.exchange as Exchange);

  return (
    <div className="grid gap-8 mt-8">
      {secrets.length > 0 && <PortfolioCard exchanges={exchanges} />}

      {secrets.length === 0 && <AddKey />}

      <section>
        <h2 className="text-headline-small mb-4">Ticker</h2>
        <TickersTable />
      </section>
    </div>
  );
}
