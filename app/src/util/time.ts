const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const getFlooredDate = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return date;
};

const getStartOfWeek = (date: Date): Date =>
  getFlooredDate(new Date(date.getTime() - date.getDay() * DAY));

const getLastOfWeek = (date: Date): Date =>
  getFlooredDate(new Date(getStartOfWeek(date).getTime() - WEEK));

const getStartOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

//todo: timezone setting
export const Time = {
  currDate: (): Date => new Date(),

  /**
   * @param date
   * @returns date가 속해있는 주의 시작을 반환합니다.
   * @description 한 주의 시작 기준은 일요일 입니다.
   */
  startOfWeek: (date: Date): Date => getStartOfWeek(date),

  /**
   * @param date
   * @returns date의 한 주 전을 반환합니다.
   */
  lastWeek: (date: Date): Date => getLastOfWeek(date),

  /**
   * @param date
   * @returns date가 속해있는 달의 시작을 반환합니다.
   */
  startOfMonth: (date: Date): Date => getStartOfMonth(date),
} as const;
