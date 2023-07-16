import { Field, ObjectType } from '@nestjs/graphql';
import { UserRank } from 'src/common/models/common.user.model';

@ObjectType()
export class PersonalVersus {
  @Field()
  levelRank: UserRank;

  @Field()
  totalScoreRank: UserRank;

  @Field()
  totalEvalCountRank: UserRank;

  @Field()
  currWeekExpIncreamentRank: UserRank;

  @Field()
  currWeekScoreRank: UserRank;

  @Field()
  currWeekEvalCountRank: UserRank;
}
