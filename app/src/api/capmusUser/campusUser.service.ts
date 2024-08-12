import { Injectable } from '@nestjs/common';
import { CampusUserDao } from './db/campusUser.db.dao';

@Injectable()
export class CampusUserService {
  constructor(private readonly campusUserDao: CampusUserDao) {}

  async getAllTransferOutUserId(): Promise<number[]> {
    return await this.campusUserDao.findAllTransferOutUserId();
  }
}
