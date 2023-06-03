import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface ICursorPaginatedType<T> {
  edges: ICursorEdge<T>[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  pageInfo: ICursorPageInfo<T>;
}

export interface ICursorPageInfo<T> {
  hasNextPage: boolean;
  endCursor: keyof T | null;
}

export interface ICursorEdge<T> {
  node: T;
  cursor: string;
}

@ObjectType({ isAbstract: true })
abstract class CursorPageInfoType<T> implements ICursorPageInfo<T> {
  @Field()
  hasNextPage: boolean;

  @Field((_type) => String, { nullable: true })
  endCursor: keyof T | null;
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
    @Field((_type) => [CursorEdgeType], { nullable: 'items' })
    edges: CursorEdgeType[];

    @Field()
    totalCount: number;

    @Field()
    pageSize: number;

    @Field()
    pageNumber: number;

    @Field((_type) => CursorPageInfoType, { nullable: true })
    pageInfo: ICursorPageInfo<T>;
  }

  return CursorPaginatedType as Type<ICursorPaginatedType<T>>;
}
