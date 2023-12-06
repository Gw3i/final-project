import AddKey from '@/components/AddKey';
import OrderCard from '@/components/OrderCard';
import Presets from '@/components/Presets';
import TickersTable from '@/components/TickersTable';
import { getAuthSession } from '@/lib/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default async function Home() {
  const session = await getAuthSession();

  const { mutate: getResponse, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get('/api/paginated-test');

      console.log(data.data);
    },
  });

  const onResponse = () => getResponse();

  return (
    <div className="grid gap-8 mt-8">
      <h1 className="text-headline-medium text-center">HOME</h1>

      <button onClick={onResponse}>GET Response</button>

      {/* {!session?.user.hasSecret && <AddKey />} */}
      <AddKey />

      <section>
        <h2 className="text-headline-small mb-4">Presets</h2>
        <Presets hasSecret={session?.user.hasSecret} />
      </section>

      <section>
        <h2 className="text-headline-small mb-4">Current Orders</h2>
        <div className="max-w-sm">
          <OrderCard />
        </div>
      </section>

      <section>
        <h2 className="text-headline-small mb-4">Ticker</h2>
        <TickersTable />
      </section>
    </div>
  );
}
