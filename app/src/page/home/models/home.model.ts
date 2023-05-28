import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectRanking } from 'src/api/project/models/project.ranking.model';
import {
  CoalitionPerValue,
  CoalitionScoreRecords,
} from 'src/api/score/models/score.coalition.model';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';
import {
  UserCountPerLevels,
  ValuePerCircle,
  ValueRecord,
} from 'src/page/total/models/total.model';

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
  @Field((_type) => NumberDateRanged, {
    description: 'HOME 주간 총 평가 횟수 (이번 주 + 지난 주)',
  })
  currWeekEvalCount: NumberDateRanged;

  @Field((_type) => NumberDateRanged, {
    description: 'HOME 주간 총 평가 횟수 (이번 주 + 지난 주)',
  })
  lastWeekEvalCount: NumberDateRanged;

  @Field((_type) => NumberDateRanged, {
    description: 'HOME 월간 누적 블랙홀 인원 (이번 달 + 지난 달)',
  })
  lastMonthBlackholedCount: NumberDateRanged;

  @Field((_type) => NumberDateRanged, {
    description: 'HOME 월간 누적 블랙홀 인원 (이번 달 + 지난 달)',
  })
  currMonthBlackholedCount: NumberDateRanged;

  @Field((_type) => [ProjectRanking], {
    description: 'HOME 지금 가장 많은 사람이 참여하는 과제',
  })
  currRegisteredCountRank: ProjectRanking[];

  @Field({ description: 'HOME 직전 회차 시험 Rank별 통과율' })
  lastExamResult: ExamResultDateRanged;

  @Field((_type) => [CoalitionPerValue], {
    description: 'HOME 역대 코알리숑 스코어 합산',
  })
  totalScores: CoalitionPerValue[];

  @Field((_type) => [CoalitionScoreRecords], {
    description: 'HOME 코알리숑별 역대 코알리숑 스코어 변동 추이',
  })
  scoreRecords: CoalitionScoreRecords[];

  @Field((_type) => Int, { description: 'HOME 역대 총 평가 횟수' })
  totalEvalCount: number;

  @Field((_type) => Int, { description: 'HOME 평균 피드백 길이' })
  averageFeedbackLength: number;

  @Field((_type) => Int, { description: 'HOME 평균 코멘트 길이' })
  averageCommentLength: number;

  @Field((_type) => [UserCountPerLevels], {
    description: 'HOME 레벨 별 유저 분포',
  })
  userCountPerLevels: UserCountPerLevels[];

  @Field((_type) => [UserRanking], { description: 'HOME 보유 월렛 랭킹' })
  walletRanks: UserRanking[];

  @Field((_type) => [UserRanking], {
    description: 'HOME 보유 평가 포인트 랭킹',
  })
  correctionPointRanks: UserRanking[];

  @Field((_type) => [ValuePerCircle], {
    description: 'HOME 전체/유저별 서클 통과 평균 기간 (uid?: number)',
  })
  averageCircleDurations: ValuePerCircle[];

  //@Field((_type) => [ValuePerCircleByPromo], { description: 'HOME 기수별 서클 통과 평균 기간' })
  //ValuePerCircleByPromo: ValuePerCircleByPromo[];

  @Field((_type) => [ValuePerCircle], {
    description: 'HOME 언제 블랙홀에 많이 빠질까',
  })
  blackholedCountPerCircles: ValuePerCircle[];

  @Field((_type) => [ValueRecord], { description: 'HOME 활성화 유저 수 추이' })
  activeUserCountRecords: ValueRecord[];

  @Field((_type) => [Int, Int], {
    description: 'HOME 주간 1인당 평가 횟수 [주간 평가 횟수, 활동 유저 수]',
  })
  currWeekAverageEvalCount: [number, number];

  @Field((_type) => [Int, Int], {
    description: 'HOME 멤버 비율 [멤버 유저 수, 전체 유저 수]',
  })
  memberPercentage: [number, number];

  @Field((_type) => [Int, Int], {
    description: 'HOME 블랙홀 유저 비율 [블랙홀 유저 수, 전체 유저 수]',
  })
  blackholedPercentage: [number, number];

  @Field((_type) => [CoalitionPerValue], {
    description: 'HOME 이번 달 누적 코알리숑 티그 횟수',
  })
  tigCountPerCoalitions: CoalitionPerValue[];
}
