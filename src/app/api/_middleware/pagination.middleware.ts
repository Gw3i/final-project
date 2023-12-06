// middleware/pagination.ts

import { Paginated } from '@/types/api-util.types.ts/pagination.types';
import { NextRequest, NextResponse } from 'next/server';

export interface PaginatedNextResponse<T> extends NextResponse {
  paginatedResults: Paginated<T>;
}

export const getPaginatedResults = (model: unknown[]) => {
  return (request: NextRequest, response: PaginatedNextResponse<unknown>, next: Function) => {
    const searchParams = request.nextUrl.searchParams;
    const pageQuery = searchParams.get('page');
    const limitQuery = searchParams.get('limit');

    if (!pageQuery || !limitQuery) return next();

    const page = parseInt(pageQuery);
    const limit = parseInt(limitQuery);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: Paginated<unknown> = {
      items: model.slice(startIndex, endIndex),
      currentPage: page,
      nextPage: endIndex < model.length ? { page: page + 1, limit } : null,
      previousPage: startIndex > 0 ? { page: page - 1, limit } : null,
      totalPageCount: Math.ceil(model.length / limit),
      limit,
    };

    response.paginatedResults = results;
    next();
  };
};
