import { generateTimestamp } from '@/app/api/_utils/binance/binance.util';
import { decrypt, generateApiPayloadSignature } from '@/app/api/_utils/security.util';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { AutoInvestPlanType, PlanStatus, SourceWallet, SubscriptionCycle, WeekDay } from '@/types/binance/order.types';
import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export interface Plan {
  planId: number;
  planType: AutoInvestPlanType;
  editAllowed: boolean;
  creationDateTime: number;
  firstExecutionDateTime: number; //first subscription date time
  nextExecutionDateTime: number;
  status: PlanStatus;
  lastUpdatedDateTime: number;
  targetAsset: string;
  totalTargetAmount: string;
  sourceAsset: string;
  totalInvestedInUSD: string;
  subscriptionAmount: string;
  subscriptionCycle: SubscriptionCycle;
  subscriptionStartDay: number | null;
  subscriptionStartWeekday: WeekDay;
  subscriptionStartTime: string;
  sourceWallet: SourceWallet;
  flexibleAllowedToUse: boolean;
  planValueInUSD: string;
  pnlInUSD: string;
  roi: string;
}

export interface PlanListSingOrPortfolio {
  planValueInUSD: string;
  planValueInBTC: string;
  pnlInUSD: string;
  roi: string;
  plans: Plan[];
}

export interface PlanListIndex {
  planValueInUSD: string;
  planValueInBTC: string;
  plans: Plan[];
}

export type PlanListResponseUnion = PlanListSingOrPortfolio | PlanListIndex;

export async function POST(request: NextRequest, response: NextResponse) {
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
      const planType = 'SINGLE';

      const params: Record<string, string> = {
        timestamp,
        planType,
      };

      const queryString = `timestamp=${timestamp}&planType=${planType}`;
      const signature = generateApiPayloadSignature(params, apiSecret);

      const response = await axios.get<AxiosResponse<PlanListResponseUnion>>(
        `https://api.binance.com/sapi/v1/lending/auto-invest/plan/list?${queryString}&signature=${signature}`,
        {
          headers: {
            'X-MBX-APIKEY': apiKey,
          },
        },
      );

      return new Response(JSON.stringify(response.data));
    };

    getAssetList(apiKey);
  } catch (error) {
    // TODO: Extend errors
    console.log(error);
    return new Response(JSON.stringify(error));
  }
}
