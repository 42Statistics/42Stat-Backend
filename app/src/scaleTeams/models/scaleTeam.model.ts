import { Field, ObjectType } from '@nestjs/graphql';
import { ScaleTeamBase } from './scaleTeam.base.model';
import { ScaleTeamTeamPartial } from './scaleTeam.partial.model';

@ObjectType()
export class ScaleTeam extends ScaleTeamBase {
  @Field()
  scales: string; // todo

  @Field((_type) => ScaleTeamTeamPartial)
  scaleTeamTeamPartial: ScaleTeamTeamPartial;

  // @Field((_type) => ScaleTeamTeam, {
  //   description: 'scaleTeam에서 추가 비용 없이 제공하는 Team Type 입니다.',
  // })
  // scaleTeamTeam: ScaleTeamTeam;
}
