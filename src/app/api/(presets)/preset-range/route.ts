import { getAuthSession } from '@/lib/auth';
import { PresetRangeTradingValidator } from '@/lib/validators/preset-form.validator';
import { FullResponse } from '@/types/binance/order.types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { generateTimestamp } from '../../_utils/binance/binance.util';
import { generateApiPayloadSignature, getSecrets } from '../../_utils/security.util';

export interface CreateRangeTradingPlan {
  apiKey: string;
  apiSecret: string;
  targetAsset: string;
  rangeLow: string;
  rangeHigh: string;
  recvWindow: string;
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { symbol, rangeLow, rangeHigh } = PresetRangeTradingValidator.parse(body);

    const transformedSymbol = symbol.toUpperCase();
    const sourceAsset = 'USDT';
    const recvWindow = '5000';
    const targetAsset = transformedSymbol + sourceAsset;

    const createRangeTradingPlan = async ({
      apiKey,
      apiSecret,
      targetAsset,
      rangeLow,
      rangeHigh,
    }: CreateRangeTradingPlan) => {
      const side = 'BUY';
      const type = 'MARKET';
      const asset = targetAsset;
      const timestamp = (await generateTimestamp()).toString();
      const symbol = asset + 'USDT';

      let planDetails: Record<string, string> = {
        side,
        type,
        targetAsset,
        timestamp,
        recvWindow,
      };

      // Generate signature
      const signature = generateApiPayloadSignature(planDetails, apiSecret);

      const queryString = `side=${side}&type${type}&symbol=${symbol}&recvWindow=${recvWindow}&timestamp=${timestamp}`;

      try {
        const response = await axios.post<AxiosResponse<FullResponse>>(
          `https://api.binance.com/api/v3/order?${queryString}&signature=${signature}`,
          null,
          {
            headers: {
              'X-MBX-APIKEY': apiKey,
            },
          },
        );

        return response.data;
      } catch (error) {
        // Handle any errors that may occur during the request
        console.error('Error creating Auto-Invest plan:', error);
        throw error;
      }
    };

    const secrets = await getSecrets(session, 'binance');

    if (!secrets) {
      return new Response('No API Key or Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const { apiKey, apiSecret } = secrets;

    const planResult = await createRangeTradingPlan({
      apiKey,
      apiSecret,
      targetAsset,
      recvWindow,
      rangeLow,
      rangeHigh,
    });

    if (planResult instanceof AxiosError) {
      return new Response(null, {
        status: planResult.status,
        statusText: planResult.message,
      });
    }

    return new Response(JSON.stringify(planResult), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
  }
}
