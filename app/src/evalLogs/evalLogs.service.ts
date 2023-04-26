import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { generatePage } from 'src/pagination/pagination.service';
import { ProjectService } from 'src/project/project.service';
import { scale_team } from 'src/scaleTeams/db/scaleTeams.database.schema';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { GetEvalLogsArgs } from './dto/evalLogs.dto.getEvalLog';
import { EvalLogsPaginated } from './models/evalLogs.model';

@Injectable()
export class EvalLogsService {
  constructor(
    private scaleTeamsService: ScaleTeamsService,
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

    return await this.scaleTeamsService.getEvalLogs(
      pageSize,
      pageNumber,
      filter,
    );
  }
}
