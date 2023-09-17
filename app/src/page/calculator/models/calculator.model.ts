import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExpTable {
  @Field()
  level: number;

  @Field()
  exp: number;
}
