import { Field, ObjectType } from '@nestjs/graphql';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserRanking } from 'src/common/models/common.user.model';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';
import { ProjectRanking } from 'src/project/models/project.ranking.model';

@ObjectType()
export class ExamResult {
  @Field()
  rank: number;

  @Field()
  passCnt: number;

  @Field()
  totalCnt: number;
}

@ObjectType()
export class ExamResultDateRanged extends ArrayDateRanged(ExamResult) {}

@ObjectType()
export class Home {
  @Field()
  currMonthBlackholedCnt: NumberDateRanged;

  @Field()
  lastMonthBlackholedCnt: NumberDateRanged; //todo: 기획에는 없지만 만들어둠 // 이거 비교하려면 필요한게 맞지 않나?

  @Field((_type) => [ProjectRanking])
  currRegisteredCntRank: ProjectRanking[];

  @Field((_type) => [UserRanking])
  monthlyExpIncrementRank: UserRanking[];

  @Field((_type) => [UserRanking])
  monthlyAccessTimeRank: UserRanking[];

  @Field((_type) => [UserRanking])
  totalEvalCntRank: UserRanking[];

  @Field((_type) => [UserRanking])
  levelRank: UserRanking[];

  @Field()
  lastExamResult: ExamResultDateRanged;
}
