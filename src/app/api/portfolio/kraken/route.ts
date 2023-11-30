import { getAuthSession } from '@/lib/auth';
import axios, { AxiosRequestConfig } from 'axios';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
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

    const otp = '123444';

    const nonce = new Date().getTime();

    const requestBody = `nonce=${nonce}${otp ? `&otp=${otp}` : ''}`;
    const apiPath = '/0/private/Balance';

    const signature = getKrakenSignature(apiPath, requestBody, apiSecret);

    const axiosRequestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `https://api.kraken.com${apiPath}`,
      headers: {
        'API-Key': apiKey,
        'API-Sign': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestBody,
    };

    const balances = await axios(axiosRequestConfig);

    if (balances.data.error && balances.data.error.length > 0) {
      console.error('Kraken API Error:', balances.data.error);
      return new Response(JSON.stringify(balances.data), { status: 500 });
    }

    return new Response(JSON.stringify(balances.data), { status: 200 });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function getKrakenSignature(urlPath: string, data: string, secret: string): string {
  const postdata = new URLSearchParams(data).toString();
  const encoded = `${urlPath}${crypto.createHash('sha256').update(data).digest('binary')}`;
  const signature = crypto.createHmac('sha512', Buffer.from(secret, 'base64')).update(encoded).digest('base64');
  return signature;
}
