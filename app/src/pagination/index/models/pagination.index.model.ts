import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface IIndexPaginatedType<T> {
  nodes: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export function IndexPaginated<T>(
  classRef: Type<T>,
): Type<IIndexPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class IndexPaginatedType implements IIndexPaginatedType<T> {
    @Field((_type) => [classRef])
    nodes: T[];

    @Field()
    totalCount: number;

    @Field()
    pageSize: number;

    @Field()
    pageNumber: number;
  }

  return IndexPaginatedType as Type<IIndexPaginatedType<T>>;
}
