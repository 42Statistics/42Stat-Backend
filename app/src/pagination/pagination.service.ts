import { PaginationArgs } from './dto/pagination.dto.args';
import { IPaginatedType } from './models/pagination.model';

export const generatePage = <T>(
  nodes: T[],
  totalCount: number,
  { pageSize, pageNumber }: PaginationArgs,
): IPaginatedType<T> => {
  return {
    nodes,
    totalCount,
    pageSize,
    pageNumber,
  } as const;
};
