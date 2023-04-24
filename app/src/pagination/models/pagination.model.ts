import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  nodes: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field((_type) => [classRef], { nullable: 'items' })
    nodes: T[];

    @Field()
    totalCount: number;

    @Field()
    pageSize: number;

    @Field()
    pageNumber: number;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
