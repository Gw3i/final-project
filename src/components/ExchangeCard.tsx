import { Exchange } from '@/types';
import Link from 'next/link';
import { FC, useContext } from 'react';
import { BalanceVisibilityContext } from './Providers';

interface ExchangeCardProps {
  exchange: Exchange;
  totalBalance: number;
}

const ExchangeCard: FC<ExchangeCardProps> = ({ exchange, totalBalance }) => {
  const { isBalanceVisible } = useContext(BalanceVisibilityContext);

  return (
    <article className="grid h-fit">
      <Link
        href={`/portfolio/${exchange?.toLowerCase()}`}
        className="shadow-sm bg-transparent border border-gray-300 rounded-[10px] p-4 hover:border-gray-200 hover:bg-gray-100 hover:bg-opacity-50 focus-visible:bg-gray-100 active:bg-gray-100 focus-visible:bg-opacity-40 active:bg-opacity-40 transition-colors"
      >
        <div className="grid uppercase font-semibold text-2xl">
          <p>{exchange.toUpperCase()}</p>
          <div>
            <p className="text-zinc-700 text-xl">${isBalanceVisible ? totalBalance.toFixed(2) : '******'}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ExchangeCard;
