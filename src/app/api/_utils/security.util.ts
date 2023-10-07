import crypto from 'crypto';

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
