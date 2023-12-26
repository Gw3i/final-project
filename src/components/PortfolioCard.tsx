'use client';

import { toast } from '@/hooks';
import { Exchange, TotalBalance } from '@/types';
import { PieChartData } from '@/types/pie-chart/pie-chart.types';
import { Dialog } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useContext, useEffect, useState } from 'react';
import AddExchangeDialog from './AddExchangeDialog';
import ExchangeCard from './ExchangeCard';
import ExchangeCardSkeleton from './ExchangeCardSkeleton';
import PieChart from './PieChart';
import { BalanceVisibilityContext } from './Providers';
import { Button } from './ui/button';
import { DialogTrigger } from './ui/dialog';
import { Skeleton } from './ui/skeleton';

interface PortfolioCardProps {
  exchanges: Exchange[];
}

const PortfolioCard: FC<PortfolioCardProps> = ({ exchanges }) => {
  const { isBalanceVisible } = useContext(BalanceVisibilityContext);
  const [totalBalances, setTotalBalances] = useState<Array<TotalBalance & { isLoading: boolean; exchange: Exchange }>>(
    [],
  );

  const { mutate: getTotalBalance, isLoading } = useMutation({
    mutationFn: async () => {
      const balancesPromises = exchanges.map(async (exchange) => {
        const url = `/api/portfolio/${exchange}/total-balance`;
        const { data } = await axios.get<TotalBalance>(url);
        return { ...data, isLoading, exchange };
      });

      const balances = await Promise.all(balancesPromises);

      setTotalBalances(balances);
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

  const balancePieChartData = totalBalances.map((balance) => {
    const data: PieChartData = {
      id: balance.exchange,
      value: Number((balance.totalFree + balance.totalStaked).toFixed(2)),
    };

    return data;
  });

  const total = balancePieChartData.reduce((prev, current) => prev + current.value, 0);

  return (
    <section className="bg-transparent border-2 border-gray-300 rounded-[10px] py-6 px-4">
      <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
      <div className="grid sm:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <div className="grid gap-2">
          {isLoading && exchanges.map((_, index) => <ExchangeCardSkeleton key={index} />)}
          {totalBalances.map((exchange) => (
            <ExchangeCard
              key={exchange.exchange}
              exchange={exchange.exchange}
              totalBalance={Number(exchange.totalFree + exchange.totalStaked)}
            />
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add exchange</Button>
            </DialogTrigger>
            <AddExchangeDialog />
          </Dialog>
        </div>
        <div className="grid justify-center w-full h-full grid-cols-1">
          <PieChart data={balancePieChartData} colorScheme="paired" />
          {isLoading ? (
            <Skeleton className="justify-self-center bg-zinc-500 w-[140px] h-[32px] rounded-md" />
          ) : (
            <p className="text-center font-semibold text-2xl">
              Total: ${isBalanceVisible ? total.toFixed(2) : '******'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioCard;
