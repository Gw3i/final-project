import { TickerMini, TickerMiniWithState } from '@/types/coins/ticker.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from './use-toast';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';
const BINANCE_24H_TICKER_URL = '/ticker/24hr';

const useTickers = (): TickerMiniWithState => {
  const [tickers, setTickers] = useState<TickerMini[] | null>(null);

  const { mutate: getTickers, isLoading } = useMutation({
    mutationFn: async () => {
      const coinPairs = '["BTCUSDT","ETHUSDT","BNBUSDT"]';
      const responseType = 'MINI';
      const tickerUrl = `${BINANCE_API_BASE_URL}${BINANCE_24H_TICKER_URL}?symbols=${coinPairs}&type=${responseType}`;

      console.log(tickerUrl);

      const { data } = await axios.get<TickerMini[]>(tickerUrl);

      console.log({ data });

      setTickers(data);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 503) {
          toast({
            title: 'Could not connect.',
            description: 'Could not connect to Ticker. Please try again or contact support.',
            variant: 'destructive',
          });
          // TODO: Add more error states
        }
      }
    },
  });

  useEffect(() => {
    getTickers();

    const interval = setInterval(getTickers, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    tickers,
    isLoading,
  };
};

export default useTickers;
