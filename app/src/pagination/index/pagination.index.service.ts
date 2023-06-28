import { Injectable } from '@nestjs/common';
import { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { IIndexPaginatedType } from './models/pagination.index.model';

@Injectable()
export class PaginationIndexService {
  toPaginated<T>(
    nodes: T[],
    { pageSize, pageNumber }: PaginationIndexArgs,
  ): IIndexPaginatedType<T> {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const paginatedData = nodes.slice(startIndex, endIndex);

    return {
      nodes: paginatedData,
      totalCount: nodes.length,
      pageSize,
      pageNumber,
    };
  }
}
