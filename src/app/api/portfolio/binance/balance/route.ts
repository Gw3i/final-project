import {
  getBinanceBalance,
  getBinanceBalanceDetails,
  getBinanceStakedBalance,
  getQueryParams,
  getSecrets,
} from '@/app/api/_utils';
import { QUERY_PARAMS_SORT_BY_VALUE, QUERY_PARAMS_SORT_ORDER_ASC } from '@/constants/query-params.constants';
import { getAuthSession } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { NormalizedBalanceWithCurrentPrice } from '@/types';
import { AxiosError } from 'axios';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secrets = await getSecrets(session, 'binance');

    if (!secrets) {
      return new Response('No API Key or Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const { apiKey, apiSecret } = secrets;

    const { limit, page, sortBy, staked, sortOrder } = getQueryParams(url);

    const balance = await getBinanceBalance(apiKey, apiSecret);
    const stakedBalance = await getBinanceStakedBalance(apiKey, apiSecret);

    const { assets: freeBalance } = await getBinanceBalanceDetails(balance);
    const { assets: lockedBalance } = await getBinanceBalanceDetails(stakedBalance);

    let assets = [...freeBalance, ...lockedBalance];

    let freeAssets: NormalizedBalanceWithCurrentPrice[] = [];
    let stakedAssets: NormalizedBalanceWithCurrentPrice[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];

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

    await redis.hset(`balance:binance`, { freeAssets, stakedAssets });

    return new Response(JSON.stringify(finalAssets), { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      return new Response(error.message, { statusText: error.response?.statusText, status: error.response?.status });
    }
  }
}
