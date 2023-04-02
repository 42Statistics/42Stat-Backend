import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectRanking } from 'src/common/models/common.project.model';
import { UserRanking } from 'src/common/models/common.user.model';

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
export class Home {
  @Field()
  currWeekEvalCnt: number;

  @Field()
  lastWeekEvalCnt: number;

  @Field()
  currMonthBlackholedCnt: number;

  @Field()
  lastMonthBlackholedCnt: number; //todo: 기획에는 없지만 만들어둠

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

  @Field((_type) => [ExamResult])
  lastExamResult: ExamResult[];
}
