import type { ValueRecord } from 'src/page/home/models/home.model';

export type AggrNumeric = { value: number };
export type AggrRecord = { records: ValueRecord[] };

export type AggrNumericPerDate = { date: string } & AggrNumeric;
export type AggrNumericPerCluster = { cluster: string } & AggrNumeric;

export type AggrDatePartition = {
  $dateToString: {
    date: Date;
    format: string;
  };
};
