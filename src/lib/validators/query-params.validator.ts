import { z } from 'zod';

export const QueryParamsValidator = z.object({
  limit: z.string().nullish().optional(),
  page: z.string().nullish().optional(),
  sortBy: z.enum(['value', 'name']).nullish().optional(),
  sortOrder: z.enum(['asc', 'desc']).nullish().optional(),
  staked: z.boolean().nullish().optional().default(false),
});

export type CreateBaseQueryParams = z.infer<typeof QueryParamsValidator>;
