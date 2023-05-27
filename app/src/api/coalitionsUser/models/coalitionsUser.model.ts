import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoalitionsUser {
  @Field()
  id: number;

  @Field()
  coalitionId: number;

  @Field()
  userId: number;

  @Field()
  score: number;

  @Field()
  rank: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
