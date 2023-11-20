import { Interval } from '@/types/binance/order.types';

export const INTERVALS: Interval[] = [
  { label: '1 Hour', value: 'H1', time: 60 * 60 * 1000 },
  { label: '4 Hours', value: 'H4', time: 4 * 60 * 60 * 1000 },
  { label: '8 Hours', value: 'H8', time: 8 * 60 * 60 * 1000 },
  { label: '12 Hours', value: 'H12', time: 12 * 60 * 60 * 1000 },
  { label: 'Daily', value: 'DAILY', time: 24 * 60 * 60 * 1000 },
  { label: 'Weekly', value: 'WEEKLY', time: 7 * 24 * 60 * 60 * 1000 },
  { label: 'Biweekly', value: 'BI_WEEKLY', time: 15 * 24 * 60 * 60 * 1000 },
  { label: 'Monthly', value: 'MONTHLY', time: 30 * 24 * 60 * 60 * 1000 },
];
