import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PersonalEvalRoot } from './models/personal.eval.model';

@Injectable()
export class PersonalEvalService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private dateRangeService: DateRangeService,
    private cursusUserSevice: CursusUserService,
  ) {}

  async pesronalEvalProfile(userId: number): Promise<PersonalEvalRoot> {
    const { cursusUser, coalition, titlesUsers } =
      await this.cursusUserSevice.userFullProfile(userId);

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

  async count(
    userId: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    return await this.scaleTeamService.evalCount({
      ...filter,
      'corrector.id': userId,
      filledAt: { $ne: null },
    });
  }

  async countByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<IntDateRanged> {
    const count = await this.count(userId, {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    });

    return this.dateRangeService.toDateRanged(count, dateRange);
  }

  async countByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.countByDateRange(userId, dateRange);
  }

  async totalDuration(userId: number): Promise<number> {
    const [totalDuration] = await this.scaleTeamService.durationInfo({
      'corrector.id': userId,
    });

    return totalDuration;
  }

  async averageDuration(userId: number): Promise<number> {
    const [totalDuration, count] = await this.scaleTeamService.durationInfo({
      'corrector.id': userId,
    });

    return Math.floor(totalDuration / count);
  }

  async averageFinalMark(userId: number): Promise<number> {
    return await this.scaleTeamService.averageFinalMark(userId);
  }

  async averageFeedbackLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback', {
      'correcteds.id': userId,
    });
  }

  async averageCommentLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment', {
      'corrector.id': userId,
    });
  }

  async lastComment(userId: number): Promise<string | null> {
    const scaleTeams = await this.scaleTeamService.findAll({
      filter: {
        'corrector.id': userId,
        filledAt: { $ne: null },
      },
      sort: { beginAt: -1, id: -1 },
      limit: 1,
    });

    return scaleTeams.at(0)?.comment ?? null;
  }

  // todo: 필요한지 확인
  async evalLogSearchUrl(userId: number): Promise<string> {
    const cursusUser = await this.cursusUserSevice.findOneByUserId(userId);

    return `https://stat.42seoul.kr/evallog?corrector=${cursusUser.user.login}`;
  }
}
