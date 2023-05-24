import {
  AggrDatePartition,
  AggrValuePerDate,
} from 'src/common/db/common.db.aggregation';

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 * @description 사용 시 sudo timedatectl 로 TimeZone 확인해야 합니다.
 * 모든 함수는 local time 기준 입니다.
 * 모든 함수는 원본을 변경하지 않습니다.
 */
export const Time = {
  SEC,
  MIN,
  HOUR,
  DAY,
  WEEK,

  // todo: 개발 용도. 완료 후 인자 제거 필요합니다.
  curr: (): Date => new Date('2023-05-18T00:00:00.000Z'),

  moveMs: (date: Date, ms: number): Date => new Date(date.getTime() + ms),

  moveDate: (date: Date, count: number): Date => {
    return new Date(date.getTime() + count * DAY);
  },

  moveWeek: (date: Date, count: number): Date => {
    return new Date(date.getTime() + count * WEEK);
  },

  moveMonth: (date: Date, count: number): Date => {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + count);

    return copy;
  },

  moveYear: (date: Date, count: number): Date => {
    const copy = new Date(date);
    copy.setFullYear(copy.getFullYear() + count);

    return copy;
  },

  /**
   * @param date
   * @returns date가 속한 날의 00시 00분 00초 를 반환합니다.
   */
  startOfDay: (date: Date): Date => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);

    return copy;
  },

  /**
   * @param date
   * @returns date가 속한 주의 일요일을 반환합니다.
   */
  startOfWeek: (date: Date): Date => {
    return Time.startOfDay(new Date(date.getTime() - date.getDay() * DAY));
  },

  startOfMonth: (date: Date): Date => {
    const copy = new Date(date);
    copy.setDate(1);

    return Time.startOfDay(copy);
  },

  startOfYear: (date: Date): Date => {
    const copy = new Date(date);
    copy.setMonth(0, 1);
    copy.setHours(0, 0, 0, 0);

    return copy;
  },

  /**
   * @example
   * start: 02-10, end: 04-20
   * return: [ 1970-01-01, 02-01, 03-01, 04-01, 04-20]
   */
  partitionByMonth: (start: Date, end: Date): Date[] => {
    const result = [new Date('1970-01-01')];

    for (
      let currDate = new Date(start);
      currDate <= end;
      currDate = Time.moveMonth(currDate, 1)
    ) {
      result.push(currDate);
    }

    result.push(end);

    return result;
  },

  /**
   * @example
   * start: 02-10, end: 04-20
   * return:
   * [
   *   { $dateToString: { date: 1970-01-01T00:00:00.000Z, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
   *   { $dateToString: { date: 02-01, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
   *   { $dateToString: { date: 03-01, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
   *   { $dateToString: { date: 04-01, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
   *   { $dateToString: { date: 04-20, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
   * ]
   */
  dateToBoundariesObject: (start: Date, end: Date): AggrDatePartition[] => {
    const dates = Time.partitionByMonth(start, end);

    return dates.map((date) => ({
      $dateToString: {
        date,
        format: '%Y-%m-%dT%H:%M:%S.%LZ',
      },
    }));
  },

  /**
   * @description
   * AggrValuePerDate[] 타입 [{ date: Date, value: number }] 에서
   * 인자로 들어온 date로 find해 해당하는 object의 value를 반환
   *
   * find에 실패시 0을 반환
   */
  getCountByDate: (date: Date, elements: AggrValuePerDate[]): number => {
    return (
      elements.find((element) => element.date === date.toISOString())?.value ??
      0
    );
  },
} as const;
