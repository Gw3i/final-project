import * as z from 'zod';

export const ApiKeyValidatorSchema = z.object({
  apiKey: z.string().min(12).max(50),
});
