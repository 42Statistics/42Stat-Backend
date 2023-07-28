import type { coalition } from 'src/api/coalition/db/coalition.database.schema';
import type { UserFullProfile } from '../cursusUser.service';
// eslint-disable-next-line

export type UserFullProfileAggr = Omit<UserFullProfile, 'coalition'> & {
  coalition?: coalition;
};
