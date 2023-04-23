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
  curr: (): Date => new Date('2023-04-10T00:00:00.000Z'),

  addMs: (date: Date, ms: number): Date => new Date(date.getTime() + ms),

  moveWeek: (date: Date, count: number): Date => {
    return new Date(date.getTime() + count * WEEK);
  },

  moveMonth: (date: Date, count: number): Date => {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + count);

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
} as const;
