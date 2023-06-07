import { Injectable } from '@nestjs/common';
import type {
  CursorPageInfo,
  ICursorEdge,
  ICursorPaginatedType,
} from './models/pagination.cursor.model';

export type CursorExtractor<T> = (doc: T) => string;
export type FieldExtractor<T> = (cursor: string) => T;

@Injectable()
export class PaginationCursorService {
  toPaginated<T>(
    nodes: T[],
    totalCount: number,
    hasNextPage: boolean,
    toCursor: CursorExtractor<T>,
  ): ICursorPaginatedType<T> {
    const edges: ICursorEdge<T>[] = nodes.map((node) => ({
      node,
      cursor: encodeCursor(toCursor(node)),
    }));

    const pageInfo: CursorPageInfo = {
      totalCount,
      hasNextPage,
      endCursor: edges.at(-1)?.cursor,
    };

    return {
      edges,
      pageInfo,
    };
  }

  toFields<Fields extends any[]>(
    cursor: string,
    extractor: FieldExtractor<Fields>,
  ): Fields {
    return extractor(decodeCursor(cursor));
  }
}

const encodeCursor = (cursor: string): string =>
  Buffer.from(cursor, 'utf-8').toString('base64');

const decodeCursor = (encodedCursor: string): string =>
  Buffer.from(encodedCursor, 'base64').toString('utf-8');
