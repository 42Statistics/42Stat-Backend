import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(private cursusUserService: CursusUserService) {}

  async getLevelRank(limit: number) {
    return await this.cursusUserService.getRank('level', limit);
  }
}
