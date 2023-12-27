import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
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
        <div className="flex gap-1">
          <Image src={`/icons/${name}.svg`} className="w-[20px] h-[20px]" width={20} height={20} alt={`${name} icon`} />
          <p>{name}</p>
        </div>
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
