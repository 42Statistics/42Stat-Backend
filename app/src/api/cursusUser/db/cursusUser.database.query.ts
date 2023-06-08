import type { FilterQuery } from 'mongoose';
import { StatDate } from 'src/statDate/StatDate';
import type { cursus_user } from './cursusUser.database.schema';

export const blackholedUserFilter: FilterQuery<cursus_user> = {
  blackholedAt: { $lt: new StatDate() },
  grade: 'Learner',
};

export const aliveUserFilter: FilterQuery<cursus_user> = {
  $or: [{ blackholedAt: { $gte: new StatDate() } }, { grade: 'Member' }],
};
