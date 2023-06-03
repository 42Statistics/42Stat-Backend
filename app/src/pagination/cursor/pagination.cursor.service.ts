import { Injectable } from '@nestjs/common';
import { PaginationIndexArgs } from '../index/dto/pagination.dto.args';
import {
  ICursorEdge,
  ICursorPageInfo,
  ICursorPaginatedType,
} from './models/pagination.cursor.model';

@Injectable()
export class PaginationCursorService {
  generatePage<T>(
    nodes: T[],
    totalCount: number,
    { pageSize, pageNumber }: PaginationIndexArgs,
    cursorField: keyof T,
  ): ICursorPaginatedType<T> {
    //todo: pagination로직, scaleteam service에 aggregate를 통한 로직이 있음
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const paginatedData = nodes.slice(startIndex, endIndex);

    const lastItem = paginatedData[paginatedData.length - 1];
    // const lastItem = nodes[nodes.length - 1];
    const endCursor: keyof T | null = lastItem
      ? (lastItem[cursorField] as keyof T)
      : null;

    const pageInfo: ICursorPageInfo<T> = {
      hasNextPage: endIndex < totalCount,
      endCursor,
    };

    // const edges: ICursorEdge<T>[] = nodes.map((node) => ({
    const edges: ICursorEdge<T>[] = paginatedData.map((node) => ({
      node,
      cursor: node[cursorField] as string,
    }));

    return {
      // nodes: paginatedData,
      edges,
      totalCount,
      pageSize,
      pageNumber,
      pageInfo,
    };
  }
}
