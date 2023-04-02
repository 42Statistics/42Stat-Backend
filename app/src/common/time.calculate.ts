import { Injectable } from '@nestjs/common';

@Injectable()
//todo export const time service
export class TimeService {
  currDate(): Date {
    return new Date();
  }
  //todo: timezone setting
  /**
   * @param currDate
   * @returns currDate가 속해있는 주의 시작을 반환합니다.
   * @description 한 주의 시작 기준은 일요일 입니다.
   */
  startOfWeek(currDate: Date): Date {
    const dayOfWeek = currDate.getDay();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const startOfWeek = new Date(currDate.getTime() - dayOfWeek * ONE_DAY);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  /**
   * @param currDate
   * @returns currDate의 한 주 전을 반환합니다.
   */
  lastWeek(currDate: Date): Date {
    const startOfWeek = this.startOfWeek(currDate);
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const lastOfWeek = new Date(startOfWeek.getTime() - ONE_WEEK);
    lastOfWeek.setHours(0, 0, 0, 0);
    return lastOfWeek;
  }

  /**
   * @param currDate
   * @returns currDate가 속해있는 달의 시작을 반환합니다.
   */
  startOfMonth(currDate: Date): Date {
    return new Date(
      Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), 1),
    );
  }
}
