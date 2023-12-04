import { getAuthSession } from '@/lib/auth';
import {
  KrakenBalance,
  KrakenBalanceResponse,
  KrakenBalanceWithCurrentPrice,
  KrakenSortedBalance,
} from '@/types/user-data/kraken-user-data.types';
import { NextRequest, NextResponse } from 'next/server';
import { Kraken } from 'node-kraken-api';
import { STACKED_ASSETS_ENDING } from '../../_constants/kraken.constants';
import { getSecrets } from '../../_utils/security.util';

interface KrakenTickerResponse {
  [key: string]: {
    a: string[] | null;
    b: string[] | null;
    c: string[] | null;
    v: string[] | null;
    p: string[] | null;
    t: string[] | null;
    l: string[] | null;
    h: string[] | null;
    o: string;
  };
}

interface KrakenSymbolWithName {
  krakenSymbol: string;
  altName: string | null;
}

export async function GET(request: NextRequest, response: NextResponse) {
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
      const assetsWithTicker: KrakenBalanceWithCurrentPrice[] = await Promise.all(
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
          const data = await kraken.ticker({ pair });

          const currentPrice = data[pair]?.o ?? null;

          return { name: assetName, value: asset.value, currentPrice, isStaked };
        }),
      );

      return assetsWithTicker;
    };

    const balanceWithTicker = await getTickerForOwnedAssets();

    const freeAssets: KrakenBalanceWithCurrentPrice[] = [];
    const stackedAssets: KrakenBalanceWithCurrentPrice[] = [];

    for (let i = 0; i < balanceWithTicker.length; i++) {
      const asset = balanceWithTicker[i];

      if (asset.isStaked) {
        stackedAssets.push(asset);
      } else {
        freeAssets.push(asset);
      }
    }

    //TODO: Add sortBy and sortOrder

    const finalAssets: KrakenSortedBalance = { freeAssets, stackedAssets };

    const data = await kraken.ticker({ pair: 'ETHUSD' });
    console.log(data);

    return new Response(JSON.stringify(finalAssets), { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500, statusText: JSON.stringify(error) });
  }
}
