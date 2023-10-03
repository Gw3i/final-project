import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ApiKeyValidator } from '@/lib/validators/api-key.validator';
import ccxt from 'ccxt';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { apiKey, apiSecret } = ApiKeyValidator.parse(body);

    // Define a secret key and an initialization vector (IV) for encryption and decryption (keep these secret!)
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error('SECRET_KEY is not defined in the environment variables.');
    }

    console.log({ apiKey, apiSecret });

    // Test connection to binance
    const exchange = new ccxt.binance({ apiKey, secret: apiSecret });
    const requiredCredentials = exchange.requiredCredentials;
    const hasRequiredCredentials = requiredCredentials.apiKey && requiredCredentials.secret;

    console.log(hasRequiredCredentials);

    if (!hasRequiredCredentials) {
      return new Response('Not valid credentials. Please try again or contact support.', { status: 403 });
    }

    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)

    // Encrypt the API key and API secret
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encryptedApiKey = cipher.update(apiKey, 'utf-8', 'hex');
    encryptedApiKey += cipher.final('hex');

    // Create a new cipher for the API secret
    const cipher2 = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encryptedApiSecret = cipher2.update(apiSecret, 'utf-8', 'hex');
    encryptedApiSecret += cipher2.final('hex');

    // Store encrypted secrets in DB
    await db.secret.create({
      data: {
        key: encryptedApiKey,
        secret: encryptedApiSecret,
        userId: session.user.id,
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

    console.log(error);
    return new Response('Could not create Connection', { status: 500 });
  }
}
