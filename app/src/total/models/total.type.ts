import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class Record {
  @Field()
  at: Date;

  @Field()
  value: number;
}

@ObjectType()
export class ValuePerCircle {
  @Field()
  circle: number;

  @Field()
  value: number;
}

export enum CoaliltionName {
  GUN,
  GON,
  GAM,
  LEE,
}

registerEnumType(CoaliltionName, {
  name: 'CoaliltionName',
});

@ObjectType()
export class TotalScore {
  @Field()
  coalitionName: CoaliltionName;

  @Field()
  score: number;
}

@ObjectType()
export class ProjectInfo {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((_type) => [String], { nullable: 'items' })
  skills: string[];

  @Field()
  averagePassFinalmark: number;

  @Field()
  averageDurationTime: number;

  @Field({ description: '총 제출 횟수 입니다.' })
  totalCloseCnt: number;

  @Field()
  currRegisteredCnt: number;

  @Field()
  passPercentage: number;

  @Field()
  totalEvalCnt: number;
}

@ObjectType()
export class ScoreRecords {
  @Field()
  coalitionName: CoaliltionName;

  @Field((_type) => [Record])
  records: Record[];
}

@ObjectType()
export class UserCntPerPoint {
  @Field()
  userCnt: number;

  @Field()
  point: number;
}

@ObjectType()
export class EvalCntPerPoint {
  @Field()
  evalCnt: number;

  @Field()
  point: number;
}

@ObjectType()
export class UserCntPerLevel {
  @Field()
  userCnt: number;

  @Field()
  level: number;
}
