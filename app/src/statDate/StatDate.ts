import {
  AggrDatePartition,
  AggrNumericPerDate,
} from 'src/common/db/common.db.aggregation';
import { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 *
 * @description 사용 시 sudo timedatectl 로 TimeZone 확인해야 합니다.
 * 모든 함수는 local time 기준 입니다.
 * 모든 함수는 원본을 변경하지 않습니다.
 */
export class StatDate extends Date {
  static readonly SEC = SEC;
  static readonly MIN = MIN;
  static readonly HOUR = HOUR;
  static readonly DAY = DAY;
  static readonly WEEK = WEEK;

  constructor();
  constructor(ms: number);
  constructor(date: Date);
  constructor(dateString: string);
  constructor(arg?: number | Date | string) {
    super(arg ?? new Date());
  }

  moveMs = (ms: number): StatDate => {
    return new StatDate(super.getTime() + ms);
  };

  moveDate = (count: number): StatDate => {
    return new StatDate(super.getTime() + count * DAY);
  };

  moveWeek = (count: number): StatDate => {
    return new StatDate(super.getTime() + count * WEEK);
  };

  moveMonth = (count: number): StatDate => {
    const copy = new StatDate(this);
    copy.setMonth(copy.getMonth() + count);

    return copy;
  };

  moveYear = (count: number): StatDate => {
    const copy = new StatDate(this);
    copy.setFullYear(copy.getFullYear() + count);

    return copy;
  };

  /**
   *
   * @param date
   * @returns date가 속한 날의 00시 00분 00초 를 반환합니다.
   */
  startOfDate = (): StatDate => {
    const copy = new StatDate(this);
    copy.setHours(0, 0, 0, 0);

    return copy;
  };

  /**
   *
   * @param date
   * @returns date가 속한 주의 일요일을 반환합니다.
   */
  startOfWeek = (): StatDate => {
    return this.moveMs(this.getDay() * DAY * -1).startOfDate();
  };

  startOfMonth = (): StatDate => {
    const copy = new StatDate(this);
    copy.setDate(1);

    return copy.startOfDate();
  };

  startOfYear = (): StatDate => {
    const copy = new StatDate(this);
    copy.setMonth(0, 1);
    copy.setHours(0, 0, 0, 0);

    return copy;
  };

  // todo: cursus user 로 이동?
  /**
   *
   * @example
   * start: 02-10, end: 04-20
   * return: [ 1970-01-01, 02-10, 03-01, 04-01, 04-20]
   */
  static partitionByMonth = ({ start, end }: DateRangeArgs): StatDate[] => {
    const partitioned = [new StatDate(0), new StatDate(start)];

    for (
      let currDate = new StatDate(start).startOfMonth().moveMonth(1);
      currDate < end;
      currDate = currDate.moveMonth(1)
    ) {
      partitioned.push(currDate);
    }

    partitioned.push(new StatDate(end));

    return partitioned;
  };

  /**
   *
   * @description
   * AggrNumericPerDate[] 타입 [{ date: Date, value: number }] 에서
   * 인자로 들어온 date로 find해 해당하는 object의 value를 반환
   *
   * find에 실패시 0을 반환
   */
  static getValueByDate = (
    date: Date,
    elements: AggrNumericPerDate[],
  ): number =>
    elements.find((element) => element.date.getTime() === date.getTime())
      ?.value ?? 0;
}
