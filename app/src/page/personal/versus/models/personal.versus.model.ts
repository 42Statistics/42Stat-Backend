import { Field, ObjectType } from '@nestjs/graphql';
import { UserRank } from 'src/common/models/common.user.model';

// todo: dateTemplate 인자 받는 형식 고치면 그에 맞게 수정

@ObjectType()
export class UserRankWithTotal extends UserRank {
  @Field()
  totalUserCount: number;
}

@ObjectType()
export class PersonalVersus {
  @Field()
  levelRankWithTotal: UserRankWithTotal;

  @Field()
  totalScoreRankWithTotal: UserRankWithTotal;

  @Field()
  totalEvalCountRankWithTotal: UserRankWithTotal;

  @Field()
  currMonthExpIncreamentRankWithTotal: UserRankWithTotal;

  @Field()
  currMonthScoreRankWithTotal: UserRankWithTotal;

  @Field()
  currMonthEvalCountRankWithTotal: UserRankWithTotal;
}
