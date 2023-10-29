import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Buy new listings</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Buy coins when they are listed on a platform. Choose a time frame or specific percentage change.
      </p>
    </section>
  );
};

export default page;
