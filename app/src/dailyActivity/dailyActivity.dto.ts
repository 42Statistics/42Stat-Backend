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

export type DailyDefaultRecord = {
  type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;
  id: number;
  at: Date;
};

export type FindDailyActivityRecordInput = {
  userId: number;
  start: Date;
  end: Date;
};

export type FindDailyActivityRecordOutput =
  | DailyLogtimeRecord
  | DailyDefaultRecord;
