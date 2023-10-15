import { INTERVALS } from '@/constants/preset-dca.constants';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { DCAPresetValidator } from '@/lib/validators/preset-form.validator';
import { FullResponse } from '@/types/binance/order.types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { generateTimestamp } from '../../_utils/binance.util';
import { decrypt, generateApiPayloadSignature } from '../../_utils/security.util';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { symbolPairLeft, symbolPairRight, interval, amount } = DCAPresetValidator.parse(body);
    const pairs = `${symbolPairLeft}${symbolPairRight}`;
    const symbol = pairs.toUpperCase();
    const side = 'BUY';
    const quantity = amount;
    const type = 'MARKET';
    const recvWindow = '5000';

    const secrets = await db.secret.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!secrets?.key || !secrets?.secret) {
      return new Response('No API Key or API Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const encryptedApiKeyWithIV = secrets.key;
    const encryptedApiSecret = secrets.secret;
    const secretKey = process.env.SECRET_KEY;
    const ivHex = encryptedApiKeyWithIV.slice(0, 32);
    const iv = Buffer.from(ivHex, 'hex');

    if (!secretKey) {
      throw new Error('Secret could not be retrieved.');
    }

    const apiKeyEncrypted = encryptedApiKeyWithIV.slice(32); // Remove the IV from the ciphertext
    const apiKey = decrypt(apiKeyEncrypted, secretKey, iv);
    const apiSecret = decrypt(encryptedApiSecret, secretKey, iv);

    // PLACE ORDER

    const placeOrder = async (apiKey: string): Promise<FullResponse> => {
      const timestamp = (await generateTimestamp()).toString();

      const params: Record<string, string> = {
        quantity,
        recvWindow,
        side,
        symbol,
        timestamp,
        type,
      };

      const queryString = `quantity=${quantity}&recvWindow=${recvWindow}&side=${side}&symbol=${symbol}&timestamp=${timestamp}&type=${type}`;
      const signature = generateApiPayloadSignature(params, apiSecret);

      const response = await axios.post<AxiosResponse<FullResponse>>(
        `https://api.binance.com/api/v3/order/test?${queryString}&signature=${signature}`,
        null,
        {
          headers: {
            'X-MBX-APIKEY': apiKey,
          },
        },
      );

      db.schedule.create({
        data: {
          schedule: 'scheduled',
          timestamp: new Date(),
        },
      });

      return response.data.data;
    };

    const order = await placeOrder(apiKey);

    const selectedInterval = INTERVALS.find((intrvl) => intrvl.value === interval);

    if (!selectedInterval?.time) {
      return new Response('Interval could not be set. Try again or contact support.', {
        status: 400,
      });
    }

    setInterval(() => placeOrder(apiKey), selectedInterval?.time);

    return new Response(JSON.stringify(order), { status: 200, statusText: 'Order created successfully.' });
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return new Response(error.message, { status: error.status });
    }

    return new Response('Could not place order. Try again or contact support');
  }
}
