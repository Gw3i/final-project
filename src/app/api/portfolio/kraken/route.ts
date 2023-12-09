import { QUERY_PARAMS_SORT_BY_VALUE, QUERY_PARAMS_SORT_ORDER_ASC } from '@/constants/query-params.constants';
import { getAuthSession } from '@/lib/auth';
import {
  KrakenBalance,
  KrakenBalanceResponse,
  KrakenBalanceWithCurrentPrice,
} from '@/types/user-data/kraken-user-data.types';
import { NextRequest } from 'next/server';
import { Kraken } from 'node-kraken-api';
import { STACKED_ASSETS_ENDING } from '../../_constants/kraken.constants';
import { getQueryParams } from '../../_utils';
import { normalizeKrakenPairs } from '../../_utils/kraken-special-pairs.util';
import { getSecrets } from '../../_utils/security.util';

interface KrakenSymbolWithName {
  krakenSymbol: string;
  altName: string | null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secrets = await getSecrets(session, 'kraken');

    if (!secrets) {
      return new Response('No API Key or Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const { limit, page, sortBy, staked, sortOrder } = getQueryParams(url);

    const { apiKey, apiSecret } = secrets;

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

    const getTickerForOwnedAssets = async () => {
      // Get KrakenSymbol and AltName
      const assets = await kraken.assets();

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

          return { name: assetName, value: asset.value, currentPrice, isStaked, totalPrice };
        }),
      );

      return assetsWithTicker;
    };

    const balanceWithTicker = await getTickerForOwnedAssets();

    let freeAssets: KrakenBalanceWithCurrentPrice[] = [];
    let stackedAssets: KrakenBalanceWithCurrentPrice[] = [];

    for (let i = 0; i < balanceWithTicker.length; i++) {
      const asset = balanceWithTicker[i];

      if (!asset) return;

      if (asset.isStaked) {
        stackedAssets.push(asset);
      } else {
        freeAssets.push(asset);
      }
    }

    if (sortBy === QUERY_PARAMS_SORT_BY_VALUE) {
      freeAssets.sort((a, b) => {
        if (!a.totalPrice || !b.totalPrice) return 0;

        if (sortOrder === QUERY_PARAMS_SORT_ORDER_ASC) {
          return a.totalPrice - b.totalPrice;
        } else {
          return b.totalPrice - a.totalPrice;
        }
      });
    }

    if (page && limit) {
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = parseInt(page) * parseInt(limit);

      freeAssets = freeAssets.slice(startIndex, endIndex);
    }

    let finalAssets: KrakenBalanceWithCurrentPrice[] = [];

    if (staked) {
      finalAssets = stackedAssets;
    } else {
      finalAssets = freeAssets;
    }

    return new Response(JSON.stringify(finalAssets), { status: 200 });
  } catch (error) {
    // TODO: Enhance error messages
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500, statusText: JSON.stringify(error) });
  }
}
