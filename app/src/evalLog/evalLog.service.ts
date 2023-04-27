import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { generatePage } from 'src/pagination/pagination.service';
import { ProjectService } from 'src/project/project.service';
import { scale_team } from 'src/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { GetEvalLogsArgs } from './dto/evalLog.dto.getEvalLog';
import { EvalLogsPaginated } from './models/evalLog.model';

@Injectable()
export class EvalLogService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private projectService: ProjectService,
  ) {}

  async getEvalLogs({
    corrector,
    corrected,
    projectName,
    outstandingOnly,
    pageSize,
    pageNumber,
  }: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    const filter: FilterQuery<scale_team> = {};

    if (projectName) {
      const projectList = await this.projectService.findByName(projectName);

      if (projectList.length === 0) {
        return generatePage([], 0, { pageSize, pageNumber });
      }

      const exactMatchProject = projectList.find(
        (project) => project.name === projectName,
      );

      filter['team.projectId'] = exactMatchProject
        ? exactMatchProject.id
        : {
            $in: projectList.map((project) => project.id),
          };
    }

    if (corrector) {
      filter['corrector.login'] = corrector;
    }

    if (corrected) {
      filter['correcteds.login'] = corrected;
    }

    if (outstandingOnly) {
      // todo: constant
      filter['flag.id'] = 9;
    }

    return await this.scaleTeamService.getEvalLogs(
      pageSize,
      pageNumber,
      filter,
    );
  }
}
