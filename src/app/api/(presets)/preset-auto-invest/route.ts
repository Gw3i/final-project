import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PresetAutoInvestValidator } from '@/lib/validators/preset-form.validator';
import { AutoInvestPlayType, SubscriptionCycle, WeekDay } from '@/types/binance/order.types';
import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt, generateApiPayloadSignature } from '../../_utils/security.util';

export interface PortfolioDetail {
  targetAsset: string;
  percentage: number;
}

export interface CreateAutoInvestPlanConfig {
  apiKey: string;
  apiSecret: string;
  targetAsset: string;
  planType: AutoInvestPlayType;
  subscriptionAmount: string;
  subscriptionCycle: SubscriptionCycle;
  sourceAsset: string;
  details?: PortfolioDetail[];
  recvWindow?: string;
  subscriptionStartWeekday?: WeekDay;
  subscriptionStartDay?: number;
}

export interface AutoInvestResponse {
  planId: number;
  nextExecutionDateTime: number;
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { symbol, interval, amount, subscriptionStartDay, subscriptionStartWeekday } =
      PresetAutoInvestValidator.parse(body);
    const targetAsset = symbol.toUpperCase();
    const sourceAsset = 'USDT';
    const planType = 'SINGLE';
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

    const createAutoInvestPlan = async ({
      apiKey,
      apiSecret,
      targetAsset,
      planType,
      subscriptionAmount,
      subscriptionCycle,
      sourceAsset,
      subscriptionStartDay,
      subscriptionStartWeekday,
    }: CreateAutoInvestPlanConfig) => {
      const sourceType = 'MAIN_SITE';
      const asset = JSON.stringify([{ targetAsset, percentage: 100 }]);

      let planDetails: Record<string, string> = {
        sourceType,
        planType,
        subscriptionAmount,
        subscriptionCycle,
        sourceAsset,
        details: asset,
      };

      if (subscriptionCycle === 'MONTHLY' && subscriptionStartDay) {
        planDetails = {
          ...planDetails,
          subscriptionStartDay: subscriptionStartDay?.toString(),
        };
      }

      if ((subscriptionCycle === 'WEEKLY' || subscriptionCycle === 'BI_WEEKLY') && subscriptionStartWeekday) {
        planDetails = {
          ...planDetails,
          subscriptionStartWeekday,
        };
      }

      // Generate signature
      const signature = generateApiPayloadSignature(planDetails, apiSecret);

      try {
        const response = await axios.post<Promise<AutoInvestResponse>>(
          'https://api.binance.com/sapi/v1/lending/auto-invest/plan/add',
          null,
          {
            params: planDetails,
            headers: {
              'X-MBX-APIKEY': apiKey,
            },
          },
        );

        // Log the response or perform other actions as needed
        console.log(response.data);

        return response.data;
      } catch (error) {
        // Handle any errors that may occur during the request
        console.error('Error creating Auto-Invest plan:', error);
        throw error;
      }
    };

    const planResult = await createAutoInvestPlan({
      apiKey,
      apiSecret,
      targetAsset,
      planType,
      sourceAsset,
      subscriptionAmount: amount,
      subscriptionCycle: interval,
      recvWindow,
      subscriptionStartDay,
      subscriptionStartWeekday,
    });

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
