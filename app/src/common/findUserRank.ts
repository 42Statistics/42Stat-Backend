import type { UserRank } from './models/common.user.model';

export const findUserRank = (
  userRanking: UserRank[],
  userId: number,
): UserRank | undefined => {
  return userRanking.find(({ userPreview }) => userPreview.id === userId);
};
