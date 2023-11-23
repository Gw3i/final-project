import { getAuthSession } from '@/lib/auth';
import { BinanceUserData } from '@/types/user-data/binance-user-data.types';
import axios, { AxiosRequestConfig } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { generateApiSignature, getSecrets } from '../../_utils/security.util';

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secrets = await getSecrets(session);

    if (!secrets) {
      return new Response('No API Key or Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const { apiKey, apiSecret } = secrets;

    const params = {
      timestamp: new Date().getTime(),
    };
    const queryString = `timestamp=${params.timestamp}`;
    const signature = generateApiSignature(queryString, apiSecret);

    const config: AxiosRequestConfig = {
      method: 'get',
      url: `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`,
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    };

    const account = await axios<BinanceUserData>(config);

    console.log(account);
  } catch (error) {
    console.log(error);
  }
}
