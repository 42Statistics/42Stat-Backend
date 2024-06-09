import { Injectable } from '@nestjs/common';
import {
  ActiveUserCount,
  GetAllActiveUserCountByDateInput,
} from './activeUserCount.dto';
import { ActiveUserCountDao } from './db/activeUserCount.db.dao';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';

@Injectable()
export class ActiveUserCountService {
  constructor(private readonly activeUserCountDao: ActiveUserCountDao) {}

  async getAllByDate(
    input: GetAllActiveUserCountByDateInput,
  ): Promise<ActiveUserCount[]> {
    const dbDataList = await this.activeUserCountDao.findAllByDate({
      start: new DateWrapper(input.start).moveMonth(-1).toDate(),
      end: input.end,
    });

    const activeUserCountList = new Array<ActiveUserCount>();
    let prevCount =
      dbDataList
        .filter((dbData) => dbData.date.getTime() < input.start.getTime())
        .at(-1)?.count ?? 0;

    for (
      let curr = input.start;
      curr.getTime() < input.end.getTime();
      curr = new DateWrapper(curr).moveMonth(1).toDate()
    ) {
      const dbData = dbDataList.find(
        ({ date }) => date.getTime() === curr.getTime(),
      );

      activeUserCountList.push({
        date: curr,
        count: dbData?.count ?? prevCount,
      });

      prevCount += dbData?.count ?? 0;
    }

    return activeUserCountList;
  }
}
