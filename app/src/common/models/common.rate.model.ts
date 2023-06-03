import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NumericRate {
  @Field()
  total: number;

  @Field()
  value: number;
}
