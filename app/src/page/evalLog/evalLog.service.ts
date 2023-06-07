import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProjectService } from 'src/api/project/project.service';
import { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  CursorExtractor,
  FieldExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { GetEvalLogsArgs } from './dto/evalLog.dto.getEvalLog';
import { EvalLog, EvalLogsPaginated } from './models/evalLog.model';

type EvalLogCursorField = [number, Date];

@Injectable()
export class EvalLogService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private projectService: ProjectService,
    private paginationCursorService: PaginationCursorService,
  ) {}

  async evalLogs({
    corrector,
    corrected,
    projectName,
    outstandingOnly,
    after,
    first,
  }: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    const filter: FilterQuery<scale_team> = {};

    if (projectName) {
      const projectList = await this.projectService.findByName(projectName);

      if (!projectList.length) {
        return this.paginationCursorService.toPaginated<EvalLog>(
          [],
          0,
          false,
          cursorExtractor,
        );
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

    // todo: scale team service 의 filter 와 어떻게 동기화할지...
    const totalCount = await this.scaleTeamService.evalCount({
      ...filter,
      feedback: { $ne: null },
      comment: { $ne: null },
    });

    if (after) {
      const [id, beginAt]: EvalLogCursorField =
        this.paginationCursorService.toFields(after, fieldExtractor);

      filter.$or = [
        { beginAt: { $lt: beginAt } },
        { beginAt, id: { $lt: id } },
      ];
    }

    const evalLogs = await this.scaleTeamService.evalLogs(first + 1, filter);

    return this.paginationCursorService.toPaginated(
      evalLogs.slice(0, first),
      totalCount,
      evalLogs.length > first,
      cursorExtractor,
    );
  }
}

const cursorExtractor: CursorExtractor<EvalLog> = (doc) =>
  doc.id.toString() + '_' + doc.header.beginAt.toISOString();

const fieldExtractor: FieldExtractor<EvalLogCursorField> = (cursor: string) => {
  const [idString, dateString] = cursor.split('_');

  return [parseInt(idString), new Date(dateString)];
};
