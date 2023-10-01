import AddKey from '@/components/AddKey';
import TickersTable from '@/components/TickersTable';

export default function Home() {
  return (
    <>
      <h1 className="text-center">Home</h1>
      <AddKey />
      <div className="mt-16">
        <TickersTable />
      </div>
    </>
  );
}
