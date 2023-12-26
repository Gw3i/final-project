import {
  QUERY_PARAMS_LIMIT,
  QUERY_PARAMS_PAGE,
  QUERY_PARAMS_SORT_BY,
  QUERY_PARAMS_SORT_ORDER,
  QUERY_PARAMS_STAKED,
} from '@/constants/query-params.constants';
import { QueryParamsValidator } from '@/lib/validators/query-params.validator';

export const getQueryParams = (url: URL) => {
  const stakedParam = url.searchParams.get(QUERY_PARAMS_STAKED) === 'true' ? true : false;

  const { limit, page, sortBy, staked, sortOrder } = QueryParamsValidator.parse({
    limit: url.searchParams.get(QUERY_PARAMS_LIMIT),
    page: url.searchParams.get(QUERY_PARAMS_PAGE),
    sortBy: url.searchParams.get(QUERY_PARAMS_SORT_BY),
    sortOrder: url.searchParams.get(QUERY_PARAMS_SORT_ORDER),
    staked: stakedParam,
  });

  return { limit, page, sortBy, staked, sortOrder };
};
