'use client';

import useTickers from '@/hooks/use-ticker';

export default function Home() {
  const tickerData = useTickers();

  console.log(tickerData.tickers);

  return (
    <>
      <h1>Home</h1>

      {(tickerData.isLoading || tickerData.tickers === null) && <p>Loading...</p>}

      {tickerData.tickers?.map((coin) => {
        return <p key={coin.firstId}>{coin.symbol}</p>;
      })}
    </>
  );
}
