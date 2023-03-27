import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExamResult {
  @Field((_type) => Int)
  rank: number;

  @Field((_type) => Int)
  passCnt: number;

  @Field((_type) => Int)
  total: number;
}
