import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetScaleTeamsArgs {
  @Field()
  filter: string;

  @Field()
  range: string;

  @Field()
  sort: string;
}
