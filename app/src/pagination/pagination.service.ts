import { Injectable } from '@nestjs/common';
import { IPaginatedType } from './pagination.type';

export interface Paginatable {
  createdAt: Date;
}

@Injectable()
export class PaginationService {
  generatePage(
    data: Paginatable[],
    first: number,
  ): IPaginatedType<Paginatable> {
    const totalCount = data.length;

    const hasNextPage = data.length > first;
    const nodes = hasNextPage ? data.slice(0, first) : data;

    const edges = nodes.map((node) => {
      return { cursor: this.getCursor(node), node: node };
    });

    const endCursor = this.getCursor(nodes[nodes.length - 1]);

    return {
      totalCount,
      edges,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    } as const;
  }

  toCursorHash = (createdAt: Date) => {
    return Buffer.from(createdAt).toString('base64');
  };

  fromCursorHash = (cursor: string) => {
    return Buffer.from(cursor, 'base64').toString('ascii');
  };

  getCursor = (node: Paginatable) => {
    return this.toCursorHash(node.createdAt);
  };
}
