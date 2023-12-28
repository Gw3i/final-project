import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ApiKeyValidator } from '@/lib/validators/api-key.validator';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { encrypt } from '../_utils/security.util';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { apiKey, apiSecret, exchange } = ApiKeyValidator.parse(body);
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error('Secret could not be retrieved.');
    }

    const iv = crypto.randomBytes(16);

    // Encrypt the API key and API secret
    const encryptedApiKey = encrypt(apiKey, secretKey, iv);
    const encryptedApiKeyWithIV = iv.toString('hex') + encryptedApiKey;

    // Create a new cipher for the API secret
    const encryptedApiSecret = encrypt(apiSecret, secretKey, iv);

    await db.secret.create({
      data: {
        key: encryptedApiKeyWithIV,
        secret: encryptedApiSecret,
        userId: session.user.id,
        exchange,
      },
    });

    await db.user.update({
      where: { id: session.user.id },
      data: {
        hasSecret: true,
      },
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response('Could not create Connection', { status: 500, statusText: JSON.stringify(error) });
  }
}
