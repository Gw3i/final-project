import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section>
      <section className="grid max-w-xl mx-auto mt-8">
        <h2 className="text-headline-small mb-4">Portfolio</h2>
        <p className="text-zinc-500 text-sm mb-8">See all you assets in one place</p>
      </section>
    </section>
  );
};

export default page;
