import { Exchange, TotalBalance } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from './use-toast';

interface UseGetTotalBalanceConfig {
  exchange: Exchange;
}

export const useGetTotalBalance = ({ exchange }: UseGetTotalBalanceConfig) => {
  const [totalBalance, setTotalBalance] = useState<TotalBalance>({ totalFree: 0, totalStaked: 0 });

  const { mutate: getTotalBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const url = `/api/portfolio/${exchange}/total-balance`;

      const data = await axios.get<TotalBalance>(url);

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

  console.log({ useGet: totalBalance, exchange });

  const totalBalanceWithLoadingState = { totalBalance, isLoading };

  return totalBalanceWithLoadingState;
};
