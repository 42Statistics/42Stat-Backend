import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface ICursorPaginatedType<T> {
  edges: ICursorEdge<T>[];
  pageInfo: CursorPageInfo;
}

export interface ICursorEdge<T> {
  node: T;
  cursor: string;
}

@ObjectType()
export class CursorPageInfo {
  @Field()
  totalCount: number;

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string;
}

export function CursorPaginated<T>(
  classRef: Type<T>,
): Type<ICursorPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class CursorEdgeType implements ICursorEdge<T> {
    @Field()
    cursor: string;

    @Field((_type) => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class CursorPaginatedType implements ICursorPaginatedType<T> {
    @Field((_type) => [CursorEdgeType])
    edges: CursorEdgeType[];

    @Field((_type) => CursorPageInfo, { nullable: true })
    pageInfo: CursorPageInfo;
  }

  return CursorPaginatedType as Type<ICursorPaginatedType<T>>;
}
