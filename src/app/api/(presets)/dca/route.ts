import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { DCAPresetValidator } from '@/lib/validators/preset-form.validator';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { symbol, interval, amount, startDate, endDate } = DCAPresetValidator.parse(body);

    console.log({ symbol, interval, amount, startDate, endDate });

    // Decrypt the API key and API secret
    const secrets = await db.secret.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!secrets?.key || secrets?.secret) {
      return new Response('No API Key or API Secret found. Please add API Key and API Secret or contact support', {
        status: 404,
      });
    }

    const encryptedApiKey = secrets.key;
    const encryptedApiSecret = secrets.secret;

    const secretKey = process.env.SECRET_KEY;

    // Retrieve the IV from the stored data (it should be part of the ciphertext)
    // For example, if the IV is prepended to the ciphertext as hex, you can extract it like this:
    const ivHex = encryptedApiKey.slice(0, 32); // Assuming the IV is 16 bytes (32 characters in hex)

    const iv = Buffer.from(ivHex, 'hex'); // Convert the IV from hex to a Buffer

    if (!secretKey) {
      throw new Error('Secret could not be retrieved.');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv); // Use the same secretKey and iv used for encryption
    let apiKey = decipher.update(encryptedApiKey, 'hex', 'utf-8');
    apiKey += decipher.final('utf-8');

    let apiSecret = decipher.update(encryptedApiSecret, 'hex', 'utf-8');
    apiSecret += decipher.final('utf-8');

    // Place order

    console.log({ apiKey, apiSecret });

    return new Response('OK');
  } catch (error) {
    console.log(error);
    return new Response('Error');
  }
}
