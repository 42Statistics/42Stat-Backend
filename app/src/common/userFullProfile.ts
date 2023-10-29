import type { Coalition } from 'src/page/common/models/coalition.model';
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import type { title } from 'src/api/title/db/title.database.schema';
import type { titles_user } from 'src/api/titlesUser/db/titlesUser.database.schema';
import type { UserPreview } from './models/common.user.model';

export type UserFullProfile = {
  cursusUser: cursus_user;
  coalition?: Coalition;
  titlesUsers: (titles_user & {
    titles: title;
  })[];
  promo?: number;
};

export const toUserPreviewFromFullProfile = (
  userFullProfile: UserFullProfile,
): UserPreview => {
  return {
    id: userFullProfile.cursusUser.user.id,
    login: userFullProfile.cursusUser.user.login,
    imgUrl: userFullProfile.cursusUser.user.image.link,
  };
};
