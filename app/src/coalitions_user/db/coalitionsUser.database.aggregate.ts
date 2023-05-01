import type { UserRanking } from 'src/common/models/common.user.model';
import type { CoalitionId } from 'src/score/db/score.database.aggregate';

export type UserRankingCoalitionId = UserRanking & CoalitionId;
export type ScoreInfo = {
  coalitionId: number;
  userId: number;
  scores: number;
};
