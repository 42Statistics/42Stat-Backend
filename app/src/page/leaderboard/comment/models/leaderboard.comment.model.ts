import { Field, ObjectType } from '@nestjs/graphql';
import {
  LeaderboardBase,
  LeaderboardElementDateRanged,
} from '../../common/models/leaderboard.model';

@ObjectType({ implements: () => LeaderboardBase })
export class LeaderboardComment {
  @Field({ description: 'TOTAL 만 가능합니다' })
  byDateTemplate: LeaderboardElementDateRanged;
}
