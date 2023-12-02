import { NormalizedBalance } from '@/types/user-data/balance.types';
import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenBalance } from '@/types/user-data/kraken-user-data.types';

export const normalizeBalance = (balance: BinanceBalance[] | KrakenBalance[]) => {
  if (isBinanceBalance(balance)) {
    return balance.map((b) => ({
      name: b.asset,
      value: b.free,
    }));
  }

  const krakenBalance: NormalizedBalance[] = [];

  Object.entries(balance).map(([_, value]) =>
    Object.entries(value).map(([key, value]) => {
      const balance = { name: key, value };

      krakenBalance.push(balance);
    }),
  );

  console.log({ krakenBalance });

  return krakenBalance;
};

export const isBinanceBalance = (value: BinanceBalance[] | KrakenBalance[]): value is BinanceBalance[] =>
  !!value[0] && 'asset' in value[0];
