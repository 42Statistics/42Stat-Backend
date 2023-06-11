import { Field, ObjectType } from '@nestjs/graphql';
import { Rate } from 'src/common/models/common.rate.model';

export type ProjectSessionInfo = Pick<
  Project,
  'id' | 'skills' | 'description' | 'estimateTime' | 'difficulty'
>;

export type TeamMemberCount = Pick<Project, 'minUserCount' | 'maxUserCount'>;

export type TeamCount = Pick<
  Project,
  | 'averagePassFinalMark'
  | 'currRegisteredTeamCount'
  | 'closedTeamCount'
  | 'evalInfo'
>;

@ObjectType()
export class Project {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field((_type) => [String], { nullable: 'items' })
  skills: string[];

  @Field()
  description: string;

  @Field()
  minUserCount: number;

  @Field()
  maxUserCount: number;

  @Field((_type) => String, { nullable: true })
  estimateTime: string | null;

  @Field()
  difficulty: number;

  @Field()
  currRegisteredTeamCount: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  closedTeamCount: number;

  @Field()
  averagePassFinalMark: number;

  @Field()
  evalInfo: Rate;
}
