import { z } from 'zod';

export const BaseQueryParamsValidator = z.object({
  sortBy: z.enum(['name', 'value']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).optional(),
});

export type CreateBaseQueryParams = z.infer<typeof BaseQueryParamsValidator>;
