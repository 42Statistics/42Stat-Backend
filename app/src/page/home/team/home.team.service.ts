import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { projects_user } from 'src/api/projectsUser/db/projectsUser.database.schema';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { ProjectRanking } from './models/home.team.model';

@Injectable()
export class HomeTeamService {
  constructor(private projectsUserService: ProjectsUserService) {}

  async temp() {
    return {
      lastExamResult: {
        data: [
          { rank: 2, passCount: 9, totalCount: 20 },
          { rank: 3, passCount: 3, totalCount: 20 },
          { rank: 4, passCount: 4, totalCount: 12 },
          { rank: 5, passCount: 8, totalCount: 18 },
          { rank: 6, passCount: 1, totalCount: 10 },
        ],
        start: new Date(),
        end: new Date(),
      },
    };
  }

  async currRegisteredCountRanking(
    limit: number,
    filter?: FilterQuery<projects_user>,
  ): Promise<ProjectRanking[]> {
    return await this.projectsUserService.currRegisteredCountRanking(
      limit,
      filter,
    );
  }
}
