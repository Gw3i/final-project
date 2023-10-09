import DCAPresetForm from '@/components/DCAPresetForm';
import { FC } from 'react';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Buy Periodically (Dollar-Cost Average(DCA))</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Dollar cost averaging is a investment strategy used to address price-related risks when investing in stocks,
        cryptocurrencies, or other assets. Instead of buying these assets at a fixed price, dollar cost averaging
        involves making smaller periodic purchases, regardless of the current price, to manage your investment.
      </p>

      <DCAPresetForm />
    </section>
  );
};

export default Page;
