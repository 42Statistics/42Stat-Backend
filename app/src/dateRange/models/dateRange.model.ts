import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface IDateRangedType<T> {
  data: T;
  start: Date;
  end: Date;
}

export function DateRanged<T>(classRef: Type<T>): Type<IDateRangedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class DateRangedType implements IDateRangedType<T> {
    @Field((_type) => classRef)
    data: T;

    @Field()
    start: Date;

    @Field()
    end: Date;
  }

  return DateRangedType as Type<IDateRangedType<T>>;
}

export interface IArrayDateRangedType<T> {
  data: T[];
  start: Date;
  end: Date;
}

export function ArrayDateRanged<T>(
  classRef: Type<T>,
): Type<IArrayDateRangedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class DateRangedType implements IArrayDateRangedType<T> {
    @Field((_type) => [classRef])
    data: T[];

    @Field()
    start: Date;

    @Field()
    end: Date;
  }

  return DateRangedType as Type<IArrayDateRangedType<T>>;
}
