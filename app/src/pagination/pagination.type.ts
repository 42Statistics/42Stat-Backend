import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface IEdgeType<T> {
  cursor: string;
  node: T;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field((_type) => String)
    cursor: string;

    @Field((_type) => classRef)
    node: T;
  }

  @ObjectType(`PageInfo`)
  abstract class PageInfo {
    @Field()
    hasNextPage: boolean;

    @Field()
    endCursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field((_type) => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field((_type) => Int)
    totalCount: number;

    @Field((_type) => PageInfo)
    pageInfo: PageInfo;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
