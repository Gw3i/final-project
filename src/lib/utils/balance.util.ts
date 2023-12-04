import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenBalanceWithCurrentPrice } from '@/types/user-data/kraken-user-data.types';

export const normalizeBalance = (balance: BinanceBalance[] | KrakenBalanceWithCurrentPrice[]) => {
  if (isBinanceBalance(balance)) {
    return balance.map((b) => ({
      name: b.asset,
      value: b.free,
      // TODO: Add currentPrice
      currentPrice: null,
      isStaked: false,
    }));
  }

  return balance;
};

export const isBinanceBalance = (
  value: BinanceBalance[] | KrakenBalanceWithCurrentPrice[],
): value is BinanceBalance[] => !!value[0] && 'asset' in value[0];
