'use client';

import useTickers from '@/hooks/use-ticker';
import { formatPriceChange } from '@/lib/utils/format-price-change';
import { useEffect, useState } from 'react';
import TickerListItem from './TickerListItem';
import TickerListItemSkeleton from './TickerListItemSkeleton';

const TickersTable = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  const symbols = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'XRPUSDT',
    'AVAXUSDT',
    'ADAUSDT',
    'SOLUSDT',
    'DOGEUSDT',
    'TRXUSDT',
    'LINKUSDT',
    'DOTUSDT',
    'MATICUSDT',
    'LTCUSDT',
    'ATOMUSDT',
  ];

  const tickerData = useTickers({ symbols, interval: 60000 });

  const addAnimation = () => {
    setIsAnimated(true);
  };

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      addAnimation();
    }
  }, []);

  const duplicatedList = [...(tickerData.tickers ?? []), ...(tickerData.tickers ?? [])];

  const renderSkeleton = () => {
    const numbersArray = [];

    for (let index = 0; index < 10; index++) {
      numbersArray.push(index);
    }
    return numbersArray.map((n) => <TickerListItemSkeleton key={n} />);
  };

  return (
    <article className="flex flex-col gap-3">
      <ul className="ticker-list" data-animated={isAnimated} data-direction="left" data-duration="slow">
        <div className="inner-scroller">
          {tickerData.isLoading && renderSkeleton()}

          {duplicatedList &&
            !tickerData.isLoading &&
            duplicatedList.map((ticker) => (
              <TickerListItem
                key={`${ticker.symbol}${Math.random()}`}
                name={ticker.symbol.replace('USDT', '')}
                price={ticker.lastPrice}
                priceChange={`${formatPriceChange(ticker.priceChangePercent)}%`}
              />
            ))}
        </div>
      </ul>

      <ul className="ticker-list" data-animated={isAnimated} data-direction="right" data-duration="medium">
        <div className="inner-scroller">
          {tickerData.isLoading && renderSkeleton()}

          {duplicatedList &&
            !tickerData.isLoading &&
            duplicatedList.map((ticker) => (
              <TickerListItem
                key={`${ticker.symbol}${Math.random()}`}
                name={ticker.symbol.replace('USDT', '')}
                price={ticker.lastPrice}
                priceChange={`${formatPriceChange(ticker.priceChangePercent)}%`}
              />
            ))}
        </div>
      </ul>
    </article>
  );
};

export default TickersTable;
