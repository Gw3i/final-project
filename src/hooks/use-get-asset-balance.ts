import { Exchange, NormalizedBalanceWithCurrentPrice } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from '.';

export const useGetAssetBalance = (exchange: Exchange) => {
  const [balance, setBalance] = useState<NormalizedBalanceWithCurrentPrice[]>([]);

  const { mutate: getBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const data = await axios.get<NormalizedBalanceWithCurrentPrice[]>(
        `/api/portfolio/${exchange}?page=1&limit=5&sortBy=value&sortOrder=desc`,
      );

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
