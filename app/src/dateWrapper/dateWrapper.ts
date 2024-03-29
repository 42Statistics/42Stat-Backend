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
export class DateWrapper {
  static readonly SEC = SEC;
  static readonly MIN = MIN;
  static readonly HOUR = HOUR;
  static readonly DAY = DAY;
  static readonly WEEK = WEEK;

  private date: Date;

  constructor(ms?: number);
  constructor(date: Date | string);
  constructor(arg?: number | Date | string) {
    this.date = arg ? new Date(arg) : new Date();
  }

  moveMs = (ms: number): DateWrapper => {
    return new DateWrapper(this.date.getTime() + ms);
  };

  moveHour = (count: number): DateWrapper => {
    return new DateWrapper(this.date.getTime() + count * HOUR);
  };

  moveDate = (count: number): DateWrapper => {
    return new DateWrapper(this.date.getTime() + count * DAY);
  };

  moveWeek = (count: number): DateWrapper => {
    return new DateWrapper(this.date.getTime() + count * WEEK);
  };

  moveMonth = (count: number): DateWrapper => {
    const copy = new DateWrapper(this.date);
    copy.date.setMonth(copy.date.getMonth() + count);

    return copy;
  };

  moveYear = (count: number): DateWrapper => {
    const copy = new DateWrapper(this.date);
    copy.date.setFullYear(copy.date.getFullYear() + count);

    return copy;
  };

  /**
   *
   * @param date
   * @returns date가 속한 날의 00 시 00 분 00 초 00 밀리 초 를 반환합니다.
   */
  startOfDate = (): DateWrapper => {
    const copy = new DateWrapper(this.date);
    copy.date.setHours(0, 0, 0, 0);

    return copy;
  };

  /**
   *
   * @param date
   * @returns date가 속한 주의 일요일을 반환합니다.
   */
  startOfWeek = (): DateWrapper => {
    return this.moveMs(this.date.getDay() * DAY * -1).startOfDate();
  };

  startOfMonth = (): DateWrapper => {
    const copy = new DateWrapper(this.date);
    copy.date.setDate(1);

    return copy.startOfDate();
  };

  startOfYear = (): DateWrapper => {
    const copy = new DateWrapper(this.date);
    copy.date.setMonth(0, 1);
    copy.date.setHours(0, 0, 0, 0);

    return copy;
  };

  toDate = (): Date => {
    return new Date(this.date);
  };

  /**
   *
   * @description
   * 두 날짜 사이의 시간 차를 밀리 초 단위로 반환
   */
  static dateGap = (a: Date, b: Date): number => {
    return a.getTime() - b.getTime();
  };

  static currMonth = (): DateWrapper => new DateWrapper().startOfMonth();
  static lastMonth = (): DateWrapper => DateWrapper.currMonth().moveMonth(-1);
  static nextMonth = (): DateWrapper => DateWrapper.currMonth().moveMonth(1);

  static currWeek = (): DateWrapper => new DateWrapper().startOfWeek();
  static lastWeek = (): DateWrapper => DateWrapper.currWeek().moveWeek(-1);
  static nextWeek = (): DateWrapper => DateWrapper.currWeek().moveWeek(1);

  static currYear = (): DateWrapper => new DateWrapper().startOfYear();

  static createByYear = (year: number): DateWrapper => {
    return new DateWrapper(`${year - 1}-12-31T15:00:00.000Z`);
  };
}
