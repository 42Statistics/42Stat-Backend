import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Paginated } from 'src/pagination/pagination.type';
import { TeamBase } from './team.base.model';
import { TeamScaleTeamPartial } from './team.partial.model';

@ObjectType()
export class Team extends TeamBase {
  @Field((_type) => [TeamScaleTeamPartial], { nullable: 'items' })
  teamScaleTeamsPartial: TeamScaleTeamPartial[];
}

@ObjectType()
export class TeamPaginated extends Paginated(Team) {}

// 이렇게 해야 추가적인 populate 를 막을 수 있습니다.
@ObjectType()
export class TeamPopulated extends OmitType(Team, [] as const) {}
