import { Paginated } from '@/types/api-util.types.ts/pagination.types';
import { NextRequest } from 'next/server';
import { PaginatedNextResponse } from '../_middleware/pagination.middleware';

interface Test {
  id: string;
  value: string;
}

const dummyData: Test[] = [
  {
    id: '1',
    value: 'Value 1',
  },
  {
    id: '2',
    value: 'Value 2',
  },
  {
    id: '3',
    value: 'Value 3',
  },
];

export default async (req: NextRequest, res: PaginatedNextResponse<Test>) => {
  // Apply the pagination middleware
  const getPaginatedResults = dummyData(req, res, () => {
    const paginatedResults = res.paginatedResults as Paginated<unknown>;
    // Now, paginatedResults contains the paginated data
  });
};
