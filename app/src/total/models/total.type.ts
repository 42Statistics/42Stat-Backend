import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class dateType {
  @Field((_type) => Date)
  At: string;

  @Field((_type) => Int)
  value: number;
}

@ObjectType()
export class blackholedCircleType {
  @Field((_type) => Int)
  circle: number;

  @Field((_type) => Int)
  value: number;

  //todo: percentage?
}

export enum coaliltionEnum {
  GUN,
  GON,
  GAM,
  LEE,
}

registerEnumType(coaliltionEnum, {
  name: 'coaliltionEnum',
});

@ObjectType()
export class totalCoalitionScoreType {
  @Field((_type) => coaliltionEnum)
  coalition: coaliltionEnum;

  @Field((_type) => Int)
  score: number;
}

@ObjectType()
export class subjectBaseType {
  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;
}

@ObjectType()
export class subjectDetailType {
  @Field((_type) => [Int])
  skills: number[];

  @Field((_type) => Int)
  averagePassScore: number;

  @Field((_type) => Int)
  averageDurationTime: number;

  @Field((_type) => Int)
  totalSubmissionsCnt: number;

  @Field((_type) => Int)
  currTeamCount: number;
}

@ObjectType()
export class subjectPassType {
  @Field((_type) => Int)
  passPercentage: number;

  @Field((_type) => Int)
  totalEvalCnt: number;
}

@ObjectType()
export class subjectInfoType {
  @Field((_type) => subjectBaseType)
  subjectBase: subjectBaseType;
  @Field((_type) => subjectDetailType)
  subjectDetail: subjectDetailType;
  @Field((_type) => subjectPassType)
  subjectPass: subjectPassType;
}

@ObjectType()
export class durationDaybyCircleType {
  @Field((_type) => Int)
  circle: number;

  @Field((_type) => Int)
  durationDay: number;
}

@ObjectType()
export class coalitionScoreChangeType {
  @Field((_type) => coaliltionEnum)
  coalition: coaliltionEnum;

  @Field((_type) => [dateType])
  info: [dateType];
}

@ObjectType()
export class userCntByPointType {
  //todo: total user count?

  @Field((_type) => Int)
  userCnt: number;

  @Field((_type) => Int)
  point: number;
}

@ObjectType()
export class evalCntByPointType {
  @Field((_type) => Int)
  evalCnt: number;

  @Field((_type) => Int)
  point: number;
}

@ObjectType()
export class userCntByLevelType {
  @Field((_type) => Int)
  userCnt: number;

  @Field((_type) => Int)
  level: number;
}
