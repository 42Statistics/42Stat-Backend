import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class Record {
  @Field((_type) => Date)
  At: string;

  @Field((_type) => Int)
  value: number;
}

@ObjectType()
export class BlackholeCircle {
  @Field((_type) => Int)
  circle: number;

  @Field((_type) => Int)
  value: number;

  //todo: percentage?
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
  @Field((_type) => CoaliltionName)
  coalitionName: CoaliltionName;

  @Field((_type) => Int)
  score: number;
}

@ObjectType()
export class ProjectInfo {
  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;

  @Field((_type) => [Int])
  skills: number[];

  @Field((_type) => Int)
  averagePassFinalmark: number;

  @Field((_type) => Int)
  averageDurationTime: number;

  @Field((_type) => Int)
  totalSubmissionsCnt: number; //총 제출 횟수

  @Field((_type) => Int)
  currRegisteredCnt: number;

  @Field((_type) => Int)
  passPercentage: number;

  @Field((_type) => Int)
  totalEvalCnt: number;
}

@ObjectType()
export class DurationDayPerCircle {
  @Field((_type) => Int)
  circle: number;

  @Field((_type) => Int)
  durationDay: number;
}

@ObjectType()
export class ScoreRecords {
  @Field((_type) => CoaliltionName)
  coalitionName: CoaliltionName;

  @Field((_type) => [Record])
  records: [Record];
}

@ObjectType()
export class UserCntPerPoint {
  //todo: total user count?

  @Field((_type) => Int)
  userCnt: number;

  @Field((_type) => Int)
  point: number;
}

@ObjectType()
export class EvalCntPerPoint {
  @Field((_type) => Int)
  evalCnt: number;

  @Field((_type) => Int)
  point: number;
}

@ObjectType()
export class UserCntPerLevel {
  @Field((_type) => Int)
  userCnt: number;

  @Field((_type) => Int)
  level: number;
}
