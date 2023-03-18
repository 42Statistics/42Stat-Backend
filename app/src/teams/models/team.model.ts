import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/pagination/pagination.type';
import { TeamScaleTeam } from './team.scaleTeam.model';
import { TeamUser } from './team.user.model';

@ObjectType()
export class Team {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((_type) => Int, { nullable: true })
  finalMark: number | null;

  @Field((_type) => ID)
  projectId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  status: string;

  @Field((_type) => Date, { nullable: true })
  terminatingAt: Date | null;

  @Field((_type) => [TeamUser])
  teamUsers: TeamUser[];

  @Field()
  isLocked: boolean;

  @Field((_type) => Boolean, { nullable: true })
  isValidated: boolean | null;

  @Field()
  isClosed: boolean;

  @Field((_type) => Date, { nullable: true })
  lockedAt: Date | null;

  @Field((_type) => Date, { nullable: true })
  closedAt: Date | null;

  @Field((_type) => ID)
  projectSessionId: string;

  @Field((_type) => [TeamScaleTeam], { nullable: 'items' })
  teamScaleTeams: TeamScaleTeam[];
}

@ObjectType()
export class TeamPaginated extends Paginated(Team) {}
