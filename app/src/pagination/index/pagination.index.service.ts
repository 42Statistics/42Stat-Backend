import { Injectable } from '@nestjs/common';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { IIndexPaginatedType } from './models/pagination.index.model';

@Injectable()
export class PaginationIndexService {
  toPaginated<T>(
    nodes: T[],
    totalCount: number,
    { pageSize, pageNumber }: PaginationIndexArgs,
  ): IIndexPaginatedType<T> {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const paginatedData = nodes.slice(startIndex, endIndex);

    return {
      nodes: paginatedData,
      totalCount,
      pageSize,
      pageNumber,
    };
  }
}
