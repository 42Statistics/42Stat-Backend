import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export type UserLogtimeRecordsByDateRangeInput = {
  userId: number;
} & DateRange;

export type UserLogtimeRecordByDateRangeOutput = {
  /**
   *
   * @description %Y-%m Date 형식
   */
  yearMonth: string;
  value: number;
};
