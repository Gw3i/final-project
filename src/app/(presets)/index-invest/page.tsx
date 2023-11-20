import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Index Invest</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Invest a specific amount diversified at least for two cryptocurrencies. For example you invest 50% in ATOM, 25%
        in LINK and 25% in DOT which eliminates the risk only investing in one cryptocurrency. This strategy will be
        executed periodically until stopped.
      </p>
    </section>
  );
};

export default page;
