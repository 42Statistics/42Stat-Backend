import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTitle {
  @Field((_type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  selected: boolean;
}
