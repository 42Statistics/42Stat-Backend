/**
 * 초기 기획 기준, date 관련 함수들을 추상화 시켜서 만들 필요가 없다고 판단했기 때문에, 특정 목적에
 * 맞게만 구현을 했습니다. 추후 이 기능이 확장이 되면 추상화해서 리팩토링 하는 것을 권합니다.
 */

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

const getStartOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

//todo: timezone setting
export const Time = {
  currDate: (): Date => new Date(),

  /**
   * @param date
   * @returns date가 속해있는 주의 일요일을 반환합니다.
   */
  startOfWeek: (date: Date): Date => getStartOfWeek(date),

  /**
   * @param date
   * @returns date 기준 일주일 전의 일요일을 반환합니다.
   */
  startOfLastWeek: (date: Date): Date =>
    getStartOfWeek(new Date(date.getTime() - WEEK)),

  /**
   * @param date
   * @returns date가 속해있는 달의 1일을 반환합니다.
   */
  startOfMonth: (date: Date): Date => getStartOfMonth(date),

  /**
   * @param date
   * @returns date 기준 한달 전의 1일을 반환합니다.
   */
  startOfLastMonth: (date: Date): Date => {
    const copy = new Date(date);
    copy.setMonth(-1);

    return getStartOfMonth(copy);
  },
} as const;
