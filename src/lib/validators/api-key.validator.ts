import * as z from 'zod';

export const ApiKeyValidator = z.object({
  exchange: z
    .string()
    .min(2, { message: 'Exchange must be at least 2 characters.' })
    .max(30, { message: 'Exchange must not be longer than 70 characters.' }),
  apiKey: z
    .string()
    .min(50, { message: 'API Key must be at least 50 characters.' })
    .max(70, { message: 'API Key must not be longer than 70 characters.' }),
  apiSecret: z
    .string()
    .min(50, { message: 'API Secret must be at least 50 characters.' })
    .max(70, { message: 'API Secret must not be longer than 70 characters.' }),
});

export type CreateApiKeyPayload = z.infer<typeof ApiKeyValidator>;
