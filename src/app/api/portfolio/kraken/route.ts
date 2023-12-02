import { getAuthSession } from '@/lib/auth';
import { KrakenBalance, KrakenSortedBalance } from '@/types/user-data/kraken-user-data.types';
import { NextRequest, NextResponse } from 'next/server';
import { Kraken } from 'node-kraken-api';
import { STACKED_ASSETS_ENDING } from '../../_constants/kraken.constants';
import { getSecrets } from '../../_utils/security.util';

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

    const balance: KrakenBalance = await kraken.balance();

    const assets: KrakenBalance[] = Object.entries(balance).map(([key, value]) => ({ [key]: value }));
    const freeAssets: KrakenBalance[] = [];
    const stackedAssets: KrakenBalance[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];

      if (Object.keys(asset).some((key) => key.includes(STACKED_ASSETS_ENDING))) {
        stackedAssets.push(asset);
      } else {
        freeAssets.push(asset);
      }
    }

    const sortedAssets: KrakenSortedBalance = { freeAssets, stackedAssets };

    return new Response(JSON.stringify(sortedAssets), { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
