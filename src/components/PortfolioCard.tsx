'use client';

import { toast } from '@/hooks';
import { Exchange, TotalBalance } from '@/types';
import { PieChartData } from '@/types/pie-chart/pie-chart.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import ExchangeCard from './ExchangeCard';
import PieChart from './PieChart';
import { Button } from './ui/button';

interface PortfolioCardProps {
  exchanges: Exchange[];
}

const PortfolioCard: FC<PortfolioCardProps> = ({ exchanges }) => {
  const [totalBalances, setTotalBalances] = useState<Array<TotalBalance & { isLoading: boolean; exchange: Exchange }>>(
    [],
  );

  const { mutate: getTotalBalance, isLoading } = useMutation({
    mutationFn: async () => {
      exchanges.map(async (exchange) => {
        const url = `/api/portfolio/${exchange}/total-balance`;

        const { data } = await axios.get<TotalBalance>(url);

        setTotalBalances((prev) => [...prev, { ...data, isLoading, exchange }]);
      });
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
  }, [exchanges]);

  const balancePieChartData = totalBalances.map((balance) => {
    const data: PieChartData = {
      id: balance.exchange,
      value: Number((balance.totalFree + balance.totalStaked).toFixed(2)),
    };

    return data;
  });

  const total = balancePieChartData.reduce((prev, current) => prev + current.value, 0);

  return (
    <section className="bg-transparent border-2 border-gray-300 rounded-[20px] py-6 px-4">
      <h1 className="text-4xl font-bold">Portfolio</h1>
      <div className="grid sm:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
        <div className="grid gap-4">
          {isLoading && <p>Loading</p>}
          {totalBalances.map((exchange) => (
            <ExchangeCard
              key={exchange.exchange}
              exchange={exchange.exchange}
              totalBalance={Number(exchange.totalFree + exchange.totalStaked)}
              isLoading={exchange.isLoading}
            />
          ))}

          <Button>Add exchange</Button>
        </div>
        <div className="grid justify-center w-full h-[300px] grid-cols-1">
          <PieChart data={balancePieChartData} colorScheme="paired" />
          <p className="text-center font-semibold text-2xl">Total: ${total.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCard;
