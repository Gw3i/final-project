import {
  QUERY_PARAMS_SORT_BY_NAME,
  QUERY_PARAMS_SORT_BY_VALUE,
  QUERY_PARAMS_SORT_ORDER_ASC,
  QUERY_PARAMS_SORT_ORDER_DESC,
} from '@/constants/query-params.constants';
import { z } from 'zod';

export const QueryParamsValidator = z.object({
  limit: z.string().nullish().optional(),
  page: z.string().nullish().optional(),
  sortBy: z.enum([QUERY_PARAMS_SORT_BY_VALUE, QUERY_PARAMS_SORT_BY_NAME]).nullish().optional(),
  sortOrder: z.enum([QUERY_PARAMS_SORT_ORDER_ASC, QUERY_PARAMS_SORT_ORDER_DESC]).nullish().optional(),
  staked: z
    .boolean()
    .nullish()
    .optional()
    .default(() => false),
});

export type CreateBaseQueryParams = z.infer<typeof QueryParamsValidator>;
