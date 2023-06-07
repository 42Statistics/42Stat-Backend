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
    //todo: pagination로직, scaleteam service에 aggregate를 통한 로직이 있음

    // const startIndex = (pageNumber - 1) * pageSize;
    // const endIndex = pageNumber * pageSize;
    // const paginatedData = nodes.slice(startIndex, endIndex);

    return {
      nodes,
      totalCount,
      pageSize,
      pageNumber,
    };
  }
}
