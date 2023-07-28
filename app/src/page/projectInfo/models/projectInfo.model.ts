import { Field, ObjectType } from '@nestjs/graphql';
import type { project } from 'src/api/project/db/project.database.schema';
import type { ProjectPreview } from 'src/common/models/common.project.model';
import { Rate } from 'src/common/models/common.rate.model';

export type ProjectSessionInfo = Pick<
  ProjectInfo,
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
export class ProjectInfo
  implements
    Pick<project, 'id' | 'name' | 'difficulty'>,
    Pick<ProjectPreview, 'circle' | 'url'>
{
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  circle?: number;

  @Field((_type) => [String])
  objectives: string[];

  @Field((_type) => [String])
  skills: string[];

  @Field()
  description: string;

  @Field()
  minUserCount: number;

  @Field()
  maxUserCount: number;

  @Field({ nullable: true })
  estimateTime?: string;

  @Field({ nullable: true })
  difficulty?: number;

  @Field()
  currRegisteredTeamCount: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  closedTeamCount: number;

  @Field()
  averagePassFinalMark: number;

  @Field()
  validatedRate: Rate;
}
