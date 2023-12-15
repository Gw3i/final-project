import { getKrakenBalanceDetails, getQueryParams, getSecrets } from '@/app/api/_utils';
import { getAuthSession } from '@/lib/auth';
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

    const { apiKey, apiSecret } = secrets;

    const { totalBalance } = await getKrakenBalanceDetails(apiKey, apiSecret);
    const { totalFree, totalStaked } = totalBalance;
    const { staked } = getQueryParams(url);

    if (staked) {
      return new Response(JSON.stringify(totalStaked), { status: 200 });
    }

    return new Response(JSON.stringify(totalFree), { status: 200 });
  } catch (error) {
    // TODO: Enhance error messages
    console.error('Internal Server Error:', error, { text: 'GetBalance' });
    return new Response('Internal Server Error', { status: 500, statusText: JSON.stringify(error) });
  }
}
