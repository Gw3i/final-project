import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenBalance } from '@/types/user-data/kraken-user-data.types';

export const normalizeBalance = (balance: BinanceBalance[] | KrakenBalance[]) => {
  if (isBinanceBalance(balance)) {
    return balance.map((b) => ({
      name: b.asset,
      value: b.free,
    }));
  }

  return balance;
};

export const isBinanceBalance = (value: BinanceBalance[] | KrakenBalance[]): value is BinanceBalance[] =>
  !!value[0] && 'asset' in value[0];
