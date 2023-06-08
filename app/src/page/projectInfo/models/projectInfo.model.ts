import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectEvalInfo {
  @Field()
  totalEvalCount: number;

  @Field()
  passCount: number;

  @Field()
  failCount: number;
}

@ObjectType()
export class ProjectInfo {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field((_type) => [String], { nullable: 'items' })
  skills: string[];

  @Field((_type) => [String], { nullable: 'items' })
  keywords: string[];

  @Field()
  description: string;

  @Field()
  minUserCount: number;

  @Field()
  maxUserCount: number;

  @Field()
  duration: number;

  @Field()
  difficulty: number;

  @Field()
  currRegisteredTeamCount: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  closedTeamCount: number;

  @Field()
  averagePassFinalMark: number;

  @Field()
  evalInfo: ProjectEvalInfo;
}
