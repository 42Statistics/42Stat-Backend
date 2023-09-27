import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Promo {
  @Field()
  promo: number;

  @Field()
  beginAt: Date;

  @Field()
  userCount: number;
}
