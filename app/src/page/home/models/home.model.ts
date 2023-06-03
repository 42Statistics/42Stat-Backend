import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/api/coalition/models/coalition.model';
import { ProjectRanking } from 'src/api/project/models/project.ranking.model';
import {
  NumberDateRanged,
  NumericRateDateRanged,
} from 'src/common/models/common.dateRanaged';
import { NumericRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class ValueRecord {
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

@ObjectType()
export class ValuePerCoalition {
  @Field()
  coalition: Coalition;

  @Field()
  value: number;
}

@ObjectType()
export class ScoreRecordPerCoalition {
  @Field()
  coalition: Coalition;

  @Field((_type) => [ValueRecord], { nullable: 'items' })
  records: ValueRecord[];
}

//@ObjectType()
//export class ValuePerCircleByPromo {
//  @Field()
//  circle: number;

//  @Field()
//  value: number;

//  @Field()
//  promo: string;
//}

@ObjectType()
export class UserCountPerLevels {
  @Field()
  userCount: number;

  @Field()
  level: number;
}

@ObjectType()
export class ExamResult {
  @Field()
  rank: number;

  @Field()
  passCount: number;

  @Field()
  totalCount: number;
}

@ObjectType()
export class ExamResultDateRanged extends ArrayDateRanged(ExamResult) {}

@ObjectType()
export class Home {
  @Field((_type) => [ValueRecord], { description: 'HOME 활성화 유저 수 추이' })
  activeUserCountRecords: ValueRecord[];

  @Field((_type) => [UserCountPerLevels])
  userCountPerLevels: UserCountPerLevels[];

  @Field()
  memberRate: NumericRate;

  @Field()
  blackholedRate: NumericRate;

  @Field()
  blackholedCountByDateTemplate: NumberDateRanged;

  @Field((_type) => [ValuePerCircle])
  blackholedCountPerCircles: ValuePerCircle[];

  @Field()
  totalEvalCount: number;

  @Field()
  evalCountByDateTemplate: NumberDateRanged;

  @Field()
  averageEvalCountByDateTemplate: NumericRateDateRanged;

  @Field()
  averageFeedbackLength: number;

  @Field()
  averageCommentLength: number;

  @Field((_type) => [ProjectRanking])
  currRegisteredCountRank: ProjectRanking[];

  @Field({ description: 'HOME 직전 회차 시험 Rank별 통과율' })
  lastExamResult: ExamResultDateRanged;

  @Field((_type) => [ValuePerCoalition])
  totalScoresPerCoalition: ValuePerCoalition[];

  @Field((_type) => [ScoreRecordPerCoalition])
  scoreRecordsPerCoalition: ScoreRecordPerCoalition[];

  @Field((_type) => [UserRanking])
  walletRanks: UserRanking[];

  @Field((_type) => [UserRanking])
  correctionPointRanks: UserRanking[];

  @Field((_type) => [ValuePerCircle])
  averageCircleDurations: ValuePerCircle[];

  @Field((_type) => [ValuePerCoalition], {
    description: 'HOME 이번 달 누적 코알리숑 티그 횟수',
  })
  tigCountPerCoalitions: ValuePerCoalition[];

  //@Field((_type) => [ValuePerCircleByPromo], { description: 'HOME 기수별 서클 통과 평균 기간' })
  //ValuePerCircleByPromo: ValuePerCircleByPromo[];
}
