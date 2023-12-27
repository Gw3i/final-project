import { ArrowDown, ArrowUp } from 'lucide-react';
import { FC } from 'react';

interface TickerListItemProps {
  name: string;
  price: string;
  priceChange: string;
}

const TickerListItem: FC<TickerListItemProps> = ({ name, price, priceChange }) => {
  return (
    <li className="grid grid-cols-[1fr,auto] gap-2 items-center bg-transparent border border-gray-300 rounded-[10px] p-2">
      <div>
        <p>{name}</p>
        <p>${price}</p>
      </div>
      <p className={`${priceChange.includes('-') ? 'text-red-500' : 'text-green-500'} flex items-center`}>
        <span>{priceChange}</span>
        <span className="text-[12px]">
          {priceChange.includes('-') ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </span>
      </p>
    </li>
  );
};

export default TickerListItem;
