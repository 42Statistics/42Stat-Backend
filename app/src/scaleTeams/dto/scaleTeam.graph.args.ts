import { Field, ObjectType } from '@nestjs/graphql';
import { GraphInterval } from 'src/graph/graph.interval';

@ObjectType()
export class ScaleTeamGraphArgs {
  @Field((_type) => GraphInterval)
  interval: GraphInterval;

  @Field()
  range: string;

  @Field()
  filter: string;
}
