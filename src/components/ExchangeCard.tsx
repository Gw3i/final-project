import { Exchange } from '@/types';
import Link from 'next/link';
import { FC, useContext } from 'react';
import { BalanceVisibilityContext } from './Providers';
import { Skeleton } from './ui/skeleton';

interface ExchangeCardProps {
  exchange: Exchange;
  totalBalance: number;
  isLoading?: boolean;
}

const ExchangeCard: FC<ExchangeCardProps> = ({ exchange, totalBalance, isLoading }) => {
  const { isBalanceVisible } = useContext(BalanceVisibilityContext);

  return (
    <article className="grid h-fit">
      <Link
        href={`/portfolio/${exchange?.toLowerCase()}`}
        className="bg-transparent border-2 border-gray-300 rounded-[20px] p-4 hover:border-gray-200 hover:bg-gray-30 hover:bg-opacity-50 focus-visible:bg-gray-100 active:bg-gray-100 focus-visible:bg-opacity-40 active:bg-opacity-40 transition-colors"
      >
        <div className="grid uppercase font-semibold text-2xl">
          <p>{exchange.toUpperCase()}</p>
          <div>
            {isLoading ? (
              <Skeleton className="bg-zinc-500 w-[100px] h-[32px] rounded-md" />
            ) : (
              <p className="text-zinc-700">${isBalanceVisible ? totalBalance.toFixed(2) : '******'}</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ExchangeCard;
