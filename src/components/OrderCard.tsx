import { FC } from 'react';

export interface Order {
  type: 'DCA';
  id: string;
  symbol: string;
  sourceAsset: string;
  price: string;
  quantity: number;
  status: 'running' | 'canceled' | 'error';
  side: 'BUY' | 'SELL';
  subscriptionCycle: 'H1' | 'H4' | 'H8' | 'H12' | 'WEEKLY' | 'DAILY' | 'MONTHLY' | 'BI_WEEKLY';
  timestamp: string;
  assetAllocation: {
    symbol: string;
    percentage: string;
  };
}

interface OrderCardProps {
  order?: Order;
}

const OrderCard: FC<OrderCardProps> = ({}) => {
  return (
    <div className="border border-zinc-700 rounded-sm p-2">
      <p>Status: running</p>
      <ul>
        <li>DCA</li>
        <li>BTC - USDT</li>
        <li>Price: 50$</li>
        <li>Cycle: 50$</li>
      </ul>
    </div>
  );
};

export default OrderCard;
