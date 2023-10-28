import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  OUTSTANDING_FLAG_ID,
  ScaleTeamService,
} from 'src/api/scaleTeam/scaleTeam.service';
import type { user } from 'src/api/user/db/user.database.schema';
import { UserService } from 'src/api/user/user.service';
import { RegexFindService } from 'src/lib/regexFind/regexFind.service';
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
    private readonly userService: UserService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly paginationCursorService: PaginationCursorService,
    private readonly regexFindService: RegexFindService,
  ) {}

  async evalLogs({
    corrector: correctorLogin,
    corrected: correctedLogin,
    projectName,
    outstandingOnly,
    imperfectOnly,
    sortOrder,
    after,
    first,
  }: GetEvalLogsArgs): Promise<EvalLogsPaginated> {
    const filter: FilterQuery<scale_team> = {};

    if (correctorLogin) {
      const corrector: Pick<user, 'id'> | null =
        await this.userService.findUserIdByLoginAndLean(correctorLogin);

      if (!corrector) {
        return this.generateEmptyLog();
      }

      filter['corrector.id'] = corrector.id;
    }

    if (correctedLogin) {
      const corrected: Pick<user, 'id'> | null =
        await this.userService.findUserIdByLoginAndLean(correctedLogin);

      if (!corrected) {
        return this.generateEmptyLog();
      }

      filter['correcteds.id'] = corrected.id;
    }

    if (imperfectOnly) {
      filter['finalMark'] = { $lt: 100 };
    }

    if (projectName) {
      const projectList = await this.regexFindService.regexFindProjectPreview(
        projectName,
        100,
      );

      if (!projectList.length) {
        return this.generateEmptyLog();
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

  private generateEmptyLog(): EvalLogsPaginated {
    return this.paginationCursorService.toPaginated<EvalLog>(
      [],
      0,
      false,
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
