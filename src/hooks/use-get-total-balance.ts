import { Exchange } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from './use-toast';

export const useGetTotalBalance = (exchange: Exchange) => {
  const [totalBalance, setTotalBalance] = useState(0);

  const { mutate: getTotalBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<number>(`/api/portfolio/${exchange}/total-balance`);

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
