import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IntRate {
  @Field()
  total: number;

  @Field()
  value: number;
}
