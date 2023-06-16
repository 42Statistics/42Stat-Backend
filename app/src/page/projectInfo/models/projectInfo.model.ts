import { Field, ObjectType } from '@nestjs/graphql';
import { Rate } from 'src/common/models/common.rate.model';

export type ProjectSessionInfo = Pick<
  ProjectInfo,
  | 'id'
  | 'objectives'
  | 'skills'
  | 'description'
  | 'estimateTime'
  | 'difficulty'
  | 'minUserCount'
  | 'maxUserCount'
>;

export type ProjectTeamInfo = Pick<
  ProjectInfo,
  | 'averagePassFinalMark'
  | 'currRegisteredTeamCount'
  | 'closedTeamCount'
  | 'validatedRate'
>;

@ObjectType()
export class ProjectInfo {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field((_type) => [String], { nullable: 'items' })
  objectives: string[];

  @Field((_type) => [String], { nullable: 'items' })
  skills: string[];

  @Field()
  description: string;

  @Field()
  minUserCount: number;

  @Field()
  maxUserCount: number;

  @Field({ nullable: true })
  estimateTime?: string;

  @Field()
  difficulty: number;

  @Field()
  currRegisteredTeamCount: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  closedTeamCount: number;

  @Field()
  averagePassFinalMark: number;

  @Field()
  validatedRate: Rate;
}
