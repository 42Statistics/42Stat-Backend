import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectEvalInfo {
  @Field()
  totalEvalCount: number;

  @Field({ description: '평가 점수가 100점 초과인 평가 수 입니다.' })
  bonusCount: number;

  @Field({ description: '평가 점수가 80 ~ 100점인 평가 수 입니다.' })
  mandatoryCount: number;

  @Field({ description: '평가 점수가 80점 미만인 평가 수 입니다.' })
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
  ongoingTeamCount: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  closedTeamCount: number;

  @Field()
  averagePassFinalmark: number;

  @Field()
  evalInfo: ProjectEvalInfo;
}
