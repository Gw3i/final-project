import { getAuthSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Kraken } from 'node-kraken-api';
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

    // const nonce = Date.now() * 1000;
    // const requestBody = `nonce=${nonce}`;
    // const apiPath = '/0/private/Balance';

    // const hashedNonce = crypto.createHash('sha256').update(nonce.toString()).digest('binary');
    // const message = hashedNonce + requestBody;
    // const signature = crypto.createHmac('sha512', Buffer.from(apiSecret, 'base64')).update(message).digest('base64');

    // const axiosRequestConfig: AxiosRequestConfig = {
    //   method: 'post',
    //   url: `https://api.kraken.com${apiPath}`,
    //   headers: {
    //     'API-Key': apiKey,
    //     'API-Sign': signature,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   data: requestBody,
    // };

    // const balances = await axios(axiosRequestConfig);

    // Uncomment the following lines if you want to handle errors
    // if (balances.data.error && balances.data.error.length > 0) {
    //   console.error('Kraken API Error:', balances.data.error);
    //   return new Response(JSON.stringify(balances.data), { status: 500 });
    // }

    const kraken = new Kraken({
      key: apiKey,
      secret: apiSecret,
      gennonce: () => new Date().getTime(),
    });

    const balance: KrakenBalance = await kraken.balance();

    console.log({ balance });

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
