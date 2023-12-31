import { getKrakenBalanceDetails, getQueryParams, getSecrets } from '@/app/api/_utils';
import { QUERY_PARAMS_SORT_BY_VALUE, QUERY_PARAMS_SORT_ORDER_ASC } from '@/constants/query-params.constants';
import { getAuthSession } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { NormalizedBalanceWithCurrentPrice } from '@/types';
import { NextRequest } from 'next/server';

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

    const balanceWithTicker = await getKrakenBalanceDetails(apiKey, apiSecret);

    let freeAssets: NormalizedBalanceWithCurrentPrice[] = [];
    let stakedAssets: NormalizedBalanceWithCurrentPrice[] = [];

    for (let i = 0; i < balanceWithTicker.assets.length; i++) {
      const asset = balanceWithTicker.assets[i];

      if (!asset) return;

      if (asset.isStaked) {
        stakedAssets.push(asset);
      } else {
        freeAssets.push(asset);
      }
    }

    let finalAssets: NormalizedBalanceWithCurrentPrice[] = [];

    if (staked) {
      finalAssets = stakedAssets;
    } else {
      finalAssets = freeAssets;
    }

    if (sortBy === QUERY_PARAMS_SORT_BY_VALUE) {
      finalAssets.sort((a, b) => {
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

      finalAssets = finalAssets.slice(startIndex, endIndex);
    }

    await redis.hset(`balance:kraken`, { freeAssets, stakedAssets });

    return new Response(JSON.stringify(finalAssets), { status: 200 });
  } catch (error) {
    // TODO: Enhance error messages
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500, statusText: JSON.stringify(error) });
  }
}
