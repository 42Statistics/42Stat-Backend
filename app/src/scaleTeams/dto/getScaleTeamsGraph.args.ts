import { ArgsType, Field } from '@nestjs/graphql';
import { GraphArgsPeriodic } from 'src/graph/graph.periodic';
import { GetScaleTeamsFilter, GetScaleTeamsRange } from './getScaleTeams.args';

@ArgsType()
export class GetScaleTeamsGraphArgs {
  @Field((_type) => GetScaleTeamsFilter, { nullable: true })
  filter: GetScaleTeamsFilter | null;

  @Field((_type) => GetScaleTeamsRange, { nullable: true })
  range: GetScaleTeamsRange | null;

  @Field((_type) => GraphArgsPeriodic, { defaultValue: {} })
  period: GraphArgsPeriodic;
}
