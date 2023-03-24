import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class examInfoType {
  @Field((_type) => Int)
  rank: number;

  @Field((_type) => Int)
  passed: number;

  @Field((_type) => Int)
  total: number;

  @Field((_type) => Float)
  percentage: number;
}

@ObjectType()
export class LastExamInfoType {
  @Field((_type) => [examInfoType])
  info: [examInfoType];
}
