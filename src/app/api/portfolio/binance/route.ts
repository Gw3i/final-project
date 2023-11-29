import { getAuthSession } from '@/lib/auth';
import { Balance } from '@/types/user-data/binance-user-data.types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { getServerTime } from '../../_utils/binance.util';
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

    const balances = await axios<Balance>(axiosRequestConfig);

    return new Response(JSON.stringify(balances.data), { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      return new Response(error.message, { statusText: error.response?.statusText, status: error.response?.status });
    }
  }
}
