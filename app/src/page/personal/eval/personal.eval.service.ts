import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import type { UserRank } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { PersonalEvalRoot } from './models/personal.eval.model';

@Injectable()
export class PersonalEvalService {
  constructor(
    private readonly teamService: TeamService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly dateRangeService: DateRangeService,
    private readonly cursusUserSevice: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
  ) {}

  @CacheOnReturn()
  async pesronalEvalProfile(userId: number): Promise<PersonalEvalRoot> {
    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    const userFullProfile =
      cachedUserFullProfile ??
      (await this.cursusUserSevice.findOneUserFullProfilebyUserId(userId));

    if (!userFullProfile) {
      throw new NotFoundException();
    }

    const { cursusUser, coalition, titlesUsers } = userFullProfile;

    return {
      userProfile: {
        id: cursusUser.user.id,
        login: cursusUser.user.login,
        imgUrl: cursusUser.user.image.link,
        grade: cursusUser.grade ?? 'No Grade',
        level: cursusUser.level,
        displayname: cursusUser.user.displayname,
        coalition,
        titles: titlesUsers.map((titleUser) => ({
          titleId: titleUser.titleId,
          name: titleUser.titles.name,
          selected: titleUser.selected,
          createdAt: titleUser.createdAt,
          updatedAt: titleUser.updatedAt,
        })),
      },
      correctionPoint: cursusUser.user.correctionPoint,
    };
  }

  @CacheOnReturn()
  async countRecord(userId: number, last: number): Promise<IntRecord[]> {
    const startDate = new DateWrapper()
      .startOfMonth()
      .moveMonth(1 - last)
      .toDate();

    const evals: { beginAt: Date }[] =
      await this.scaleTeamService.findAllAndLean({
        filter: {
          'corrector.id': userId,
          beginAt: { $gte: startDate },
        },
        select: {
          beginAt: 1,
        },
      });

    const res = evals.reduce((acc, { beginAt }) => {
      const date = new DateWrapper(beginAt).startOfMonth().toDate().getTime();

      const prev = acc.get(date);

      acc.set(date, (prev ?? 0) + 1);

      return acc;
    }, new Map() as Map<number, number>);

    const records: IntRecord[] = [];

    for (let i = 0; i < last; i++) {
      const currDate = new DateWrapper(startDate).moveMonth(i).toDate();

      records.push({ at: currDate, value: res.get(currDate.getTime()) ?? 0 });
    }

    return records;
  }

  private async count(
    userId: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    return await this.scaleTeamService.evalCount({
      ...filter,
      'corrector.id': userId,
    });
  }

  private async countByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<IntDateRanged> {
    const count = await this.count(userId, {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    });

    return this.dateRangeService.toDateRanged(count, dateRange);
  }

  @CacheOnReturn()
  async countByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    if (dateTemplate === DateTemplate.TOTAL) {
      const count = await this.count(userId);

      return this.dateRangeService.toDateRanged(count, dateRange);
    }

    return await this.countByDateRange(userId, dateRange);
  }

  @CacheOnReturn()
  async totalDuration(userId: number): Promise<number> {
    const [totalDuration] = await this.scaleTeamService.durationInfo({
      'corrector.id': userId,
    });

    return totalDuration;
  }

  @CacheOnReturn()
  async averageDuration(userId: number): Promise<number> {
    const [totalDuration, count] = await this.scaleTeamService.durationInfo({
      'corrector.id': userId,
    });

    return count !== 0 ? Math.floor(totalDuration / count) : 0;
  }

  @CacheOnReturn()
  async averageFinalMark(userId: number): Promise<number> {
    return await this.scaleTeamService.averageFinalMark(userId);
  }

  @CacheOnReturn()
  async averageFeedbackLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback', {
      'correcteds.id': userId,
    });
  }

  @CacheOnReturn()
  async averageCommentLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment', {
      'corrector.id': userId,
    });
  }

  /**
   *
   * @description
   * cache 에 nullable 한 값이 들어갈 수 없기 때문에, object 로 한번 감싸서 반환합니다.
   * `CacheOnReturn` 데코레이터 자체를 object 로 감싸서 저장하도록 수정할 수 있지만,
   * 일단 이런 상황이 다른 곳에선 발생할 일이 없어서 보류 중 입니다.
   */
  @CacheOnReturn()
  async recentComment(userId: number): Promise<{ value: string | null }> {
    const scaleTeams: Pick<scale_team, 'comment'>[] =
      await this.scaleTeamService.findAllAndLean({
        filter: { 'corrector.id': userId },
        sort: { beginAt: -1, id: -1 },
        limit: 1,
        select: { comment: 1 },
      });

    return { value: scaleTeams.at(0)?.comment ?? null };
  }

  @CacheOnReturn()
  async destinyRanking(userId: number, limit: number): Promise<UserRank[]> {
    return await this.teamService.destinyRanking(userId, limit);
  }
}
