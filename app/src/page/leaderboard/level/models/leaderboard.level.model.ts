import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElement } from '../../models/leaderboard.model';

@ObjectType()
export class LeaderboardLevel {
  @Field({ description: '누적 레벨 랭킹' })
  level: LeaderboardElement;
}
