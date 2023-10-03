import * as z from 'zod';

export const ApiKeyValidator = z.object({
  apiKey: z.string().min(50).max(70),
  apiSecret: z.string().min(50).max(70),
});

export type CreateApiKeyPayload = z.infer<typeof ApiKeyValidator>;
