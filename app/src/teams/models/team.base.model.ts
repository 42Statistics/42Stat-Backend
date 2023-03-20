import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { TeamUserSpecific } from './team.specific.model';

@ObjectType()
export class TeamBase {
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

  @Field((_type) => [TeamUserSpecific])
  teamUsers: TeamUserSpecific[];

  @Field()
  isLocked: boolean;

  @Field()
  isClosed: boolean;

  @Field((_type) => Boolean, { nullable: true })
  isValidated: boolean | null;

  @Field((_type) => Date, { nullable: true })
  lockedAt: Date | null;

  @Field((_type) => Date, { nullable: true })
  closedAt: Date | null;

  @Field((_type) => ID)
  projectSessionId: string;
}
