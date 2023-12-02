import { z } from 'zod';

export const BalanceValidator = z.object({
  sortBy: z.enum(['name', 'value']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateBalancePayload = z.infer<typeof BalanceValidator>;
