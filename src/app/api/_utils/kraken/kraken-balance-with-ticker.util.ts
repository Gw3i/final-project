import {
  KrakenBalance,
  KrakenBalanceResponse,
  KrakenBalanceWithCurrentPrice,
} from '@/types/user-data/kraken-user-data.types';
import { Kraken } from 'node-kraken-api';

import { normalizeKrakenPairs } from '.';
import { STACKED_ASSETS_ENDING } from '../../_constants/kraken.constants';
import { TotalBalance } from '@/types';

interface KrakenSymbolWithName {
  krakenSymbol: string;
  altName: string | null;
}

export const getKrakenBalanceDetails = async (apiKey: string, apiSecret: string) => {
  // Connext to Kraken
  const kraken = new Kraken({
    key: apiKey,
    secret: apiSecret,
    gennonce: () => new Date().getTime(),
  });

  const balance: KrakenBalanceResponse = await kraken.balance();

  // Normalize Assets
  const krakenBalance: KrakenBalance[] = [];

  Object.entries(balance).forEach(([key, value]) => {
    const balance = { name: key, value };

    krakenBalance.push(balance);
  });

  // Get KrakenSymbol and AltName
  const assets = await kraken.assets();
  const totalBalance: TotalBalance = {
    totalFree: 0,
    totalStaked: 0,
  };

  const assetsWithSymbolName: KrakenSymbolWithName[] = Object.entries(assets).map(([key, value]) => ({
    krakenSymbol: key,
    altName: value.altname ?? null,
  }));

  const currency = 'USD';
  const assetsWithTicker: Array<KrakenBalanceWithCurrentPrice | null> = await Promise.all(
    krakenBalance.map(async (asset) => {
      let assetName = asset.name;
      let isStaked = false;

      assetsWithSymbolName.forEach((a) => {
        if (assetName === a.krakenSymbol && a.altName) {
          assetName = a.altName;
        }
      });

      if (assetName.includes(STACKED_ASSETS_ENDING)) {
        const newName = assetName.replace(STACKED_ASSETS_ENDING, '');
        assetName = newName;
        isStaked = true;
      }

      const pair = assetName + currency;
      const normalizedPair = normalizeKrakenPairs(pair);

      const data = await kraken.ticker({ pair });
      const currentPrice = data[normalizedPair ?? pair]?.o ?? null;

      const totalPrice = currentPrice ? Number(asset.value) * Number(currentPrice) : null;

      if (isStaked) {
        totalBalance.totalStaked = totalBalance.totalStaked + (totalPrice ?? 0);
      } else {
        totalBalance.totalFree = totalBalance.totalFree + (totalPrice ?? 0);
      }

      return { name: assetName, value: asset.value, currentPrice, isStaked, totalPrice };
    }),
  );

  return { assets: assetsWithTicker, totalBalance };
};
