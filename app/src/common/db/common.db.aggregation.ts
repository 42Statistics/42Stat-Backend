import type { ValueRecord } from 'src/total/models/total.model';

export type AggrNumeric = { value: number };
export type AggrRecord = { records: ValueRecord[] };

export type AggrValuePerDate = { date: string } & AggrNumeric;

export type AggrDatePartition = {
  $dateToString: {
    date: Date;
    format: string;
  };
};
