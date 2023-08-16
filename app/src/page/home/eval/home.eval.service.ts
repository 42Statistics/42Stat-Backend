import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  AVERAGE_COMMENT_LENGTH,
  AVERAGE_FEEDBACK_LENGTH,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';

@Injectable()
export class HomeEvalService {
  constructor(
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
    private readonly cursusUserService: CursusUserService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async totalEvalCount(): Promise<number> {
    return await this.scaleTeamService.evalCount();
  }

  async evalCountRecords(last: number): Promise<IntRecord[]> {
    const startDate = new DateWrapper()
      .startOfDate()
      .moveDate(1 - last)
      .toDate();

    const evals: { beginAt: Date }[] =
      await this.scaleTeamService.findAllAndLean({
        filter: { beginAt: { $gte: startDate } },
        select: { beginAt: 1 },
      });

    const res = evals.reduce((acc, { beginAt }) => {
      const date = new DateWrapper(beginAt).startOfDate().toDate().getTime();

      const prev = acc.get(date);

      acc.set(date, (prev ?? 0) + 1);

      return acc;
    }, new Map() as Map<number, number>);

    const records: IntRecord[] = [];

    for (let i = 0; i < last; i++) {
      const currDate = new DateWrapper(startDate).moveDate(i).toDate();

      records.push({ at: currDate, value: res.get(currDate.getTime()) ?? 0 });
    }

    return records;
  }

  async averageFeedbackLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_FEEDBACK_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('feedback'))
    );
  }

  async averageCommentLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_COMMENT_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('comment'))
    );
  }
}
