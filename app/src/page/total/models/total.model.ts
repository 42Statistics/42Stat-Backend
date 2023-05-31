import { Field, ObjectType } from '@nestjs/graphql';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';

@ObjectType()
export class Total {
  @Field((_type) => UserRankingDateRanged, { description: ' ' })
  monthlyScoreRanks: UserRankingDateRanged;
}
