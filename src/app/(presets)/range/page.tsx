import RangeTradingPresetForm from '@/components/RangeTradingPresetForm';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="grid max-w-xl mx-auto mt-8">
      <h2 className="text-headline-small mb-4">Range Trading</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Range trading is a proactive investment approach in which the investor defines a specific price range within
        which to buy or sell cryptocurrency over a short period. For instance, if BTC is currently trading at $35,000,
        and you anticipate it will reach $40,000 in the coming weeks, you can expect it to stay within the range of
        $35,000 to $40,000. You can engage in range trading by purchasing BTC at $35,000 and selling it when it hits
        $40,000. This strategy can be repeated until stopped.
      </p>

      <RangeTradingPresetForm />
    </section>
  );
};

export default page;
