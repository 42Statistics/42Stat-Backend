import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardLevel {
  @Field({ description: 'TOTAL 만 가능합니다' })
  byDateTemplate: LeaderboardElementDateRanged;
}
