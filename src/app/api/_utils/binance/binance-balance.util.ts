import { BINANCE_24H_TICKER_URL, BINANCE_API_BASE_URL } from '@/constants/binance.constants';
import {
  BinanceBalance,
  BinanceStakedBalance,
  NormalizedBalanceWithCurrentPrice,
  TickerFull,
  TotalBalance,
} from '@/types';
import axios, { AxiosRequestConfig } from 'axios';
import { getServerTime } from '.';
import { generateApiSignature } from '..';
import { RESPONSE_TYPE_FULL } from '../../_constants/binance.constants';

interface BinanceStakedFlexibleBalance {
  totalAmount: string;
  latestAnnualPercentageRate: string;
  asset: string;
  canRedeem: boolean;
  collateralAmount: string;
  productId: string;
  yesterdayRealTimeRewards: string;
  cumulativeBonusRewards: string;
  cumulativeRealTimeRewards: string;
  cumulativeTotalRewards: string;
  autoSubscribe: boolean;
}

interface BinanceStakedLockedBalance {
  positionId: number;
  productId: string;
  asset: string;
  amount: string;
  purchaseTime: Date;
  duration: number;
  accrualDays: number;
  rewardAsset: string;
  rewardAmt: string;
  nextPay: string;
  nextPayDate: number;
  payPeriod: number;
  redeemAmountEarly: string;
  rewardsEndDate: Date;
  deliverDate: Date;
  redeemPeriod: number;
  canRedeemEarly: true;
  autoSubscribe: false;
  type: string;
  status: string;
  canReStake: false;
  apy: string;
}

interface BinanceStakedFlexibleBalanceWithRows {
  rows: BinanceStakedFlexibleBalance[];
  total: number;
}

interface BinanceStakedLockedBalanceWithRows {
  rows: BinanceStakedLockedBalance[];
  total: number;
}

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

export const getBinanceBalanceDetails = async (balances: BinanceBalance[] | BinanceStakedBalance[]) => {
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

  const responseType = RESPONSE_TYPE_FULL;
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

        // TODO: Add totalStaked
        if (isBinanceStakedBalance(asset)) {
          totalBalance.totalStaked = totalBalance.totalStaked + totalPrice;
        } else {
          totalBalance.totalFree = totalBalance.totalFree + totalPrice;
        }

        const assetWithCurrentPrice: NormalizedBalanceWithCurrentPrice = {
          name: asset.asset,
          currentPrice: ticker.lastPrice,
          value: asset.free,
          totalPrice,
          isStaked: isBinanceStakedBalance(asset) ? true : false,
        };

        assetsWithTicker.push(assetWithCurrentPrice);
      }
    });
  });

  console.log({ balanceWithDetails });

  return balanceWithDetails;
};

export const getBinanceStakedBalance = async (apiKey: string, apiSecret: string) => {
  const getStakedBalance = async (type: 'flexible' | 'locked') => {
    const timestamp = await getServerTime();
    const recvWindow = '5000';

    const queryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = generateApiSignature(queryString, apiSecret);

    const axiosRequestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `https://api.binance.com/sapi/v1/simple-earn/${type}/position?${queryString}&signature=${signature}`,
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    };

    const { data } = await axios<BinanceStakedFlexibleBalanceWithRows | BinanceStakedLockedBalanceWithRows>(
      axiosRequestConfig,
    );

    const normalizedBalance: BinanceStakedBalance[] = data.rows.map((asset) => {
      const balance: BinanceStakedBalance = {
        asset: '',
        free: '',
        isStaked: true,
      };

      if (isBinanceStakedFlexibleBalance(asset)) {
        balance.asset = asset.asset;
        balance.free = asset.totalAmount;
      } else {
        balance.asset = asset.asset;
        balance.free = asset.amount;
      }

      return balance;
    });

    return normalizedBalance;
  };

  const freeAssets = await getStakedBalance('flexible');
  const lockedAssets = await getStakedBalance('locked');

  return [...freeAssets, ...lockedAssets];
};

const isBinanceStakedFlexibleBalance = (
  value: BinanceStakedFlexibleBalance | BinanceStakedLockedBalance,
): value is BinanceStakedFlexibleBalance => 'collateralAmount' in value;

const isBinanceStakedBalance = (value: BinanceBalance | BinanceStakedBalance): value is BinanceStakedBalance =>
  'isStaked' in value;
