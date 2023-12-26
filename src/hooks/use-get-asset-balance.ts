import { CreateBaseQueryParams } from '@/lib/validators/query-params.validator';
import { Exchange, NormalizedBalanceWithCurrentPrice } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from '.';

export interface UseGetTotalBalanceConfig {
  exchange: Exchange;
  queryParams?: CreateBaseQueryParams;
}

export const useGetAssetBalance = ({ exchange, queryParams }: UseGetTotalBalanceConfig) => {
  const [balance, setBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);

  const { mutate: getBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const queryString = Object.entries(queryParams ?? {})
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const url = `/api/portfolio/${exchange}/balance`;
      let fullUrl = url;

      if (queryString.length) {
        fullUrl = `${url}?${queryString}`;
      }

      const data = await axios.get<NormalizedBalanceWithCurrentPrice[]>(fullUrl);

      setBalance(data.data);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          title: error.message,
          description: error.response?.data,
          variant: 'destructive',
        });
      }
    },
  });

  useEffect(() => {
    getBalance();
  }, []);

  return { balance, isLoading };
};
