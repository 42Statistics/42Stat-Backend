import type { coalition } from 'src/api/coalition/db/coalition.database.schema';
import type { UserFullProfile } from 'src/common/userFullProfile';

export type UserFullProfileAggr = Omit<UserFullProfile, 'coalition'> & {
  coalition?: coalition;
};
