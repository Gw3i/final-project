import AddKey from '@/components/AddKey';
import TickersTable from '@/components/TickersTable';
import { getAuthSession } from '@/lib/auth';

export default async function Home() {
  const session = await getAuthSession();

  // TODO: Move Balance visibility as context

  return (
    <div className="grid gap-8 mt-8">
      <h1 className="text-headline-medium text-center">HOME</h1>

      <AddKey />

      <section>
        <h2 className="text-headline-small mb-4">Ticker</h2>
        <TickersTable />
      </section>
    </div>
  );
}
