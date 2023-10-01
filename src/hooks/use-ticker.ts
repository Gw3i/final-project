import { BINANCE_24H_TICKER_URL, BINANCE_API_BASE_URL } from '@/constants/binance.constants';
import { TickerFull, TickerMiniWithState, TickersConfig } from '@/types/coins/ticker.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from './use-toast';

const useTickers = (config: TickersConfig): TickerMiniWithState => {
  const [tickers, setTickers] = useState<TickerFull[] | null>(null);

  const { mutate: getTickers, isLoading } = useMutation({
    mutationFn: async () => {
      const responseType = 'FULL';

      const tickerUrl = `${BINANCE_API_BASE_URL}${BINANCE_24H_TICKER_URL}?symbols=${JSON.stringify(
        config.symbols,
      )}&type=${responseType}`;

      const { data } = await axios.get<TickerFull[]>(tickerUrl);

      setTickers(data);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast({
            title: 'Not found',
            description: 'Could not found. Please try again or contact support.',
            variant: 'destructive',
          });
        }

        // TODO: Add more error states
      }
    },
  });

  useEffect(() => {
    getTickers();

    const interval = setInterval(getTickers, config.interval ?? 600000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tickers,
    isLoading,
  };
};

export default useTickers;
