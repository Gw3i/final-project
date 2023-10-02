import AddKey from '@/components/AddKey';
import Presets from '@/components/Presets';
import TickersTable from '@/components/TickersTable';
import { getAuthSession } from '@/lib/auth';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-center">Home</h1>
      {!session?.user.hasSecret && <AddKey />}
      <Presets />
      <div className="mt-16">
        <TickersTable />
      </div>
    </>
  );
}
