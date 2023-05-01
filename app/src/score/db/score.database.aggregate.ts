import type {
  AggrNumeric,
  AggrRecord,
} from 'src/common/db/common.db.aggregation';

export type CoalitionId = { coalitionId: number };
export type CoalitionScore = CoalitionId & AggrNumeric;
export type CoalitionScoreRecords = CoalitionId & AggrRecord;
