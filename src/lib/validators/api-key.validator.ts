import * as z from 'zod';

export const ApiKeyValidator = z.object({
  apiKey: z.string().min(12).max(50),
  apiSecret: z.string().min(12).max(50),
});

export type CreateApiKeyPayload = z.infer<typeof ApiKeyValidator>;
