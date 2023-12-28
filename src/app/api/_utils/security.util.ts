import { db } from '@/lib/db';
import { Exchange } from '@/types/exchanges/exchange';
import crypto from 'crypto';
import { Session } from 'next-auth';

export const encrypt = (text: string, secretKey: string, iv: Buffer) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encrypted: string, secretKey: string, iv: Buffer) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

export const generateApiSignature = (queryString: string, apiSecret: string) => {
  return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
};

export const generateApiPayloadSignature = (params: Record<string, string>, apiSecret: string) => {
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
};

export const getSecrets = async (session: Session, exchange: Exchange) => {
  const secrets = await db.secret.findFirst({
    where: {
      userId: session.user.id,
      exchange,
    },
  });

  if (!secrets?.key || !secrets?.secret) {
    return null;
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

  return { apiKey, apiSecret };
};
