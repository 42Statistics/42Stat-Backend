import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamInfoBase {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;
}
