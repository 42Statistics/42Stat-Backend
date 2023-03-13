import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamUser {
  @Field((_type) => Int)
  id: number;

  @Field()
  login: string;

  @Field()
  isLeader: boolean;

  @Field((_type) => Int)
  occurrence: number;

  @Field((_type) => Int)
  projectUserId: number;
}
