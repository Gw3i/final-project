import { generateTimestamp } from '@/app/api/_utils/binance.util';
import { decrypt, generateApiPayloadSignature } from '@/app/api/_utils/security.util';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { AutoInvestAssetsResponse } from '@/types/binance/order.types';
import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

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

    const apiKeyEncrypted = encryptedApiKeyWithIV.slice(32);
    const apiKey = decrypt(apiKeyEncrypted, secretKey, iv);
    const apiSecret = decrypt(encryptedApiSecret, secretKey, iv);

    const getAssetList = async (apiKey: string) => {
      const timestamp = (await generateTimestamp()).toString();
      const size = '8';
      const recvWindow = '60000';

      const params: Record<string, string> = {
        timestamp,
        size,
        recvWindow,
      };

      const queryString = `timestamp=${timestamp}&size=${size}&recWindow=${recvWindow}`;
      const signature = generateApiPayloadSignature(params, apiSecret);
      const signtr = crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');

      const response = await axios.get<AxiosResponse<AutoInvestAssetsResponse>>(
        `https://api.binance.com/sapi/v1/lending/auto-invest/target-asset/list?${queryString}&signature=${signtr}`,
        {
          headers: {
            'X-MBX-APIKEY': apiKey,
          },
        },
      );

      console.log(response.data);

      return response.data;
    };

    const assetList = await getAssetList(apiKey);

    return new Response(JSON.stringify(assetList), { status: 200, statusText: 'Worked' });
  } catch (error) {
    // TODO: Extend errors
    console.log(error);
    return new Response(JSON.stringify(error));
  }
}
