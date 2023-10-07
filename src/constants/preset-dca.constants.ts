import { Interval } from '@/types/binance/order.types';

export const INTERVALS: Interval[] = [
  { label: '1 Hour', value: '1h', time: 60 * 60 * 1000 },
  { label: '12 Hours', value: '12h', time: 12 * 60 * 60 * 1000 },
  { label: '1 Day', value: '1d', time: 24 * 60 * 60 * 1000 },
  { label: '1 Week', value: '1w', time: 7 * 24 * 60 * 60 * 1000 },
  { label: '1 Month', value: '1m', time: 30 * 24 * 60 * 60 * 1000 },
  { label: '2 Months', value: '2m', time: 60 * 24 * 60 * 60 * 1000 },
  { label: '3 Months', value: '3m', time: 90 * 24 * 60 * 60 * 1000 },
];
