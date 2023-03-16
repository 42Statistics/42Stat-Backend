import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TeamScaleTeam } from './team.scaleTeam.model';
import { TeamUser } from './team.user.model';

@ObjectType()
export class Team {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  finalMark?: number;

  @Field((_type) => ID)
  projectId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  terminatingAt?: Date;

  @Field((_type) => [TeamUser])
  teamUsers: TeamUser[];

  @Field()
  isLocked: boolean;

  @Field({ nullable: true })
  isValidated: boolean;

  @Field()
  isClosed: boolean;

  @Field({ nullable: true })
  lockedAt: Date;

  @Field({ nullable: true })
  closedAt: Date;

  @Field((_type) => ID)
  projectSessionId: string;

  @Field((_type) => [TeamScaleTeam], { nullable: 'items' })
  teamScaleTeams: TeamScaleTeam[];

  @Field()
  usersPopulated: string; // todo: user

  @Field()
  projectPopulated: string; // todo: project
}
