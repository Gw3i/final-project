import { getBinanceBalance, getBinanceBalanceDetails, getBinanceStakedBalance, getSecrets } from '@/app/api/_utils';
import { getAuthSession } from '@/lib/auth';
import { redis } from '@/lib/redis';
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

    const balance = await getBinanceBalance(apiKey, apiSecret);
    const stakedBalance = await getBinanceStakedBalance(apiKey, apiSecret);

    const { totalBalance } = await getBinanceBalanceDetails(balance);
    const { totalBalance: totalStakedBalance } = await getBinanceBalanceDetails(stakedBalance);
    const { totalFree } = totalBalance;
    const { totalStaked } = totalStakedBalance;

    await redis.hset(`totalBalance:binance`, { totalFree, totalStaked });

    return new Response(JSON.stringify({ totalFree, totalStaked }), { status: 200 });
  } catch (error) {
    // TODO: Enhance error messages
    return new Response('Internal Server Error', { status: 500, statusText: JSON.stringify(error) });
  }
}
