import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamService } from 'src/api/team/team.service';
import type { TeamInfo } from './models/teamInfo.model';

@Injectable()
export class TeamInfoService {
  constructor(private readonly teamService: TeamService) {}

  async getTeamInfo(id: number): Promise<TeamInfo> {
    const teamInfo = await this.teamService.teamInfo(id);

    if (!teamInfo) {
      throw new NotFoundException();
    }

    return teamInfo;
  }
}
