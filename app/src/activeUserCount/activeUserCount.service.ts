import { Injectable } from '@nestjs/common';
import {
  ActiveUserCount,
  GetAllActiveUserCountByDateInput,
} from './activeUserCount.dto';
import { ActiveUserCountDao } from './db/activeUserCount.db.dao';

@Injectable()
export class ActiveUserCountService {
  constructor(private readonly activeUserCountDao: ActiveUserCountDao) {}

  async getAllByDate(
    input: GetAllActiveUserCountByDateInput,
  ): Promise<ActiveUserCount[]> {
    const activeUserCountList = await this.activeUserCountDao.findAllByDate({
      start: input.start,
      end: input.end,
    });

    return activeUserCountList;
  }
}
