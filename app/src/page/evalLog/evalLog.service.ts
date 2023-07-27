import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ProjectService } from 'src/api/project/project.service';
import { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  OUTSTANDING_FLAG_ID,
  ScaleTeamService,
} from 'src/api/scaleTeam/scaleTeam.service';
import {
  CursorExtractor,
  FieldExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import {
  EvalLogSortOrder,
  GetEvalLogsArgs,
} from './dtos/evalLog.dto.getEvalLog';
import { EvalLog, EvalLogsPaginated } from './models/evalLog.model';

type EvalLogCursorField = [number, Date];

@Injectable()
export class EvalLogService {
  constructor(
    private readonly scaleTeamService: ScaleTeamService,
    private readonly projectService: ProjectService,
    private readonly cursusUserService: CursusUserService,
    private readonly paginationCursorService: PaginationCursorService,
  ) {}

  async evalLogs({
    corrector: correctorLogin,
    corrected: correctedLogin,
    projectName,
    outstandingOnly,
    sortOrder,
    after,
    first,
  }: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    const filter: FilterQuery<scale_team> = {};

    if (correctorLogin) {
      const corrector = await this.cursusUserService.findOneAndLeanByLogin(
        correctorLogin,
      );

      if (!corrector) {
        throw new NotFoundException();
      }

      filter['corrector.id'] = corrector.user.id;
    }

    if (correctedLogin) {
      const corrected = await this.cursusUserService.findOneAndLeanByLogin(
        correctedLogin,
      );

      if (!corrected) {
        throw new NotFoundException();
      }

      filter['correcteds.id'] = corrected.user.id;
    }

    if (projectName) {
      const projectList = await this.projectService.findProjectPreviewByName(
        projectName,
        100,
      );

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

    if (outstandingOnly) {
      filter['flag.id'] = OUTSTANDING_FLAG_ID;
    }

    const totalCount = await this.scaleTeamService.evalCount(filter);

    if (after) {
      const [id, beginAt]: EvalLogCursorField =
        this.paginationCursorService.toFields(after, fieldExtractor);

      switch (sortOrder) {
        case EvalLogSortOrder.BEGIN_AT_ASC:
          filter.$or = [
            { beginAt: { $gt: beginAt } },
            { beginAt, id: { $gt: id } },
          ];
          break;
        case EvalLogSortOrder.BEGIN_AT_DESC:
          filter.$or = [
            { beginAt: { $lt: beginAt } },
            { beginAt, id: { $lt: id } },
          ];
          break;
      }
    }

    const evalLogs = await this.scaleTeamService.evalLogs(
      first + 1,
      sortOrder,
      filter,
    );

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
