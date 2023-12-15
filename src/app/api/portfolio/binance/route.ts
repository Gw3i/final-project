import { BINANCE_24H_TICKER_URL, BINANCE_API_BASE_URL } from '@/constants/binance.constants';
import { QUERY_PARAMS_SORT_BY_VALUE, QUERY_PARAMS_SORT_ORDER_ASC } from '@/constants/query-params.constants';
import { getAuthSession } from '@/lib/auth';
import { TickerFull } from '@/types/coins/ticker.types';
import { NormalizedBalanceWithCurrentPrice } from '@/types/user-data/balance.types';
import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { NextRequest } from 'next/server';
import { getQueryParams } from '../../_utils';
import { getServerTime } from '../../_utils/binance.util';
import { generateApiSignature, getSecrets } from '../../_utils/security.util';

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

    const timestamp = await getServerTime();
    const recvWindow = '5000';

    const queryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = generateApiSignature(queryString, apiSecret);

    const axiosRequestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `https://api.binance.com/sapi/v3/asset/getUserAsset?${queryString}&signature=${signature}`,
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    };

    const balances = await axios<BinanceBalance[]>(axiosRequestConfig);

    const getTickerForOwnedAssets = async () => {
      const assets = balances.data;
      const currency = 'USDT';

      const symbols = assets
        .filter((asset) => asset.asset !== currency)
        .map((asset) => {
          return asset.asset + currency;
        });

      const responseType = 'FULL';
      const tickerUrl = `${BINANCE_API_BASE_URL}${BINANCE_24H_TICKER_URL}?symbols=${JSON.stringify(
        symbols,
      )}&type=${responseType}`;

      const { data } = await axios.get<TickerFull[]>(tickerUrl);

      let assetsWithTicker: NormalizedBalanceWithCurrentPrice[] = [];

      data.forEach((ticker) => {
        assets.forEach((asset) => {
          const tickerSymbol = ticker.symbol.replace(currency, '');

          if (asset.asset === tickerSymbol) {
            const totalPrice = parseInt(asset.free) * parseInt(ticker.lastPrice);

            // TODO: Check for staked assets.
            const assetWithCurrentPrice: NormalizedBalanceWithCurrentPrice = {
              name: asset.asset,
              currentPrice: ticker.lastPrice,
              value: asset.free,
              isStaked: false,
              totalPrice,
            };

            assetsWithTicker.push(assetWithCurrentPrice);
          }
        });
      });

      return assetsWithTicker;
    };

    let assetsWithTicker = await getTickerForOwnedAssets();

    if (sortBy === QUERY_PARAMS_SORT_BY_VALUE) {
      assetsWithTicker.sort((a, b) => {
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

      assetsWithTicker = assetsWithTicker.slice(startIndex, endIndex);
    }

    // TODO: Return totalBalance

    return new Response(JSON.stringify(assetsWithTicker), { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      return new Response(error.message, { statusText: error.response?.statusText, status: error.response?.status });
    }
  }
}
