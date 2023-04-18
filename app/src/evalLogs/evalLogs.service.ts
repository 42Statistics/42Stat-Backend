import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProjectService } from 'src/project/project.service';
import { scale_team } from 'src/scaleTeams/db/scaleTeams.database.schema';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { GetEvalLogsArgs } from './dto/evalLogs.dto.getEvalLog';
import { EvalLogs } from './models/evalLogs.model';

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
  }: GetEvalLogsArgs): Promise<EvalLogs[]> {
    const filter: FilterQuery<scale_team> = {};

    if (projectName) {
      const projectList = await this.projectService.findByName(projectName);

      if (projectList.length === 0) {
        return [];
      }

      filter['team.projectId'] = {
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
      filter,
      pageSize,
      pageNumber,
    );
  }
}
