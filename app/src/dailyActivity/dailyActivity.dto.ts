import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export enum DailyActivityType {
  CORRECTOR,
  CORRECTED,
  EVENT,
  LOGTIME,
}

export type DailyLogtimeRecord = {
  type: DailyActivityType.LOGTIME;
  value: number;
  date: Date;
};

export type DailyLogtimeDetailRecord = Omit<DailyLogtimeRecord, 'date'>;

export type DailyDefaultRecord = {
  type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;
  id: number;
  at: Date;
};

export type DailyEventDetailRecord = {
  type: DailyActivityType.EVENT;
  id: number;
  name: string;
  location: string;
  beginAt: Date;
  endAt: Date;
};

export type DailyEvaluationDetailRecord = {
  type: DailyActivityType.CORRECTED | DailyActivityType.CORRECTOR;
  id: number;
  correctorLogin: string;
  teamId: number;
  leaderLogin: string;
  projectName: string;
  beginAt: Date;
  filledAt: Date;
};

export type FindDailyActivityRecordInput = {
  userId: number;
} & DateRange;

export type FindDailyActivityRecordOutput =
  | DailyLogtimeRecord
  | DailyDefaultRecord;

export type FindDailyActivityDetailRecordInput = {
  userId: number;
  idsWithType: {
    type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;
    id: number;
  }[];
};

export type FindDailyActivityDetailRecordOutput =
  | DailyEventDetailRecord
  | DailyEvaluationDetailRecord;
