import { BINANCE_24H_TICKER_URL, BINANCE_API_BASE_URL } from '@/constants/binance.constants';
import { BinanceBalance, NormalizedBalanceWithCurrentPrice, TickerFull, TotalBalance } from '@/types';
import axios, { AxiosRequestConfig } from 'axios';
import { getServerTime } from '.';
import { generateApiSignature } from '..';

export const getBinanceBalance = async (apiKey: string, apiSecret: string) => {
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

  const { data } = await axios<BinanceBalance[]>(axiosRequestConfig);

  return data;
};

export const getBinanceBalanceDetails = async (balances: BinanceBalance[]) => {
  const assets = balances;
  const currency = 'USDT';
  const totalBalance: TotalBalance = {
    totalFree: 0,
    totalStaked: 0,
  };

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
  const balanceWithDetails = { assets: assetsWithTicker, totalBalance };

  data.forEach((ticker) => {
    assets.forEach((asset) => {
      const tickerSymbol = ticker.symbol.replace(currency, '');

      if (asset.asset === tickerSymbol) {
        const totalPrice = parseFloat(asset.free) * parseFloat(ticker.lastPrice);
        totalBalance.totalFree = totalBalance.totalFree + totalPrice;

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

  return balanceWithDetails;
};
