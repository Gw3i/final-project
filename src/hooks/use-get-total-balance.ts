import { CreateBaseQueryParams } from '@/lib/validators/query-params.validator';
import { Exchange } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from './use-toast';

interface UseGetTotalBalanceConfig {
  exchange: Exchange;
  staked?: boolean;
}

export const useGetTotalBalance = ({ exchange, staked }: UseGetTotalBalanceConfig) => {
  const [totalBalance, setTotalBalance] = useState(0);

  const { mutate: getTotalBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const stakedQueryParam: CreateBaseQueryParams = { staked: true };
      const queryString = Object.entries(stakedQueryParam)
        .map(([key, value]) => value && `${key}=${encodeURIComponent(value.toString())}`)
        .join('');

      const url = `/api/portfolio/${exchange}/total-balance`;

      let fullUrl = url;

      if (staked) {
        fullUrl = `${url}?${queryString}`;
      }

      const data = await axios.get<number>(fullUrl);

      setTotalBalance(data.data);
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
    getTotalBalance();
  }, []);

  const totalBalanceWithLoadingState = { totalBalance, isLoading };

  return totalBalanceWithLoadingState;
};
