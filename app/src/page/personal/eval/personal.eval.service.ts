import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PersonalEval } from './models/personal.eval.model';

@Injectable()
export class PersonalEvalService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private dateRangeService: DateRangeService,
    private cursusUserSevice: CursusUserService,
  ) {}

  async pesronalEvalProfile(
    userId: number,
  ): Promise<Pick<PersonalEval, 'userProfile' | 'correctionPoint'>> {
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

  // todo
  async totalDuration(userId: number): Promise<number> {
    return 12345;
  }

  async averageDuration(userId: number): Promise<number> {
    return await this.scaleTeamService.averageDurationMinute({
      'corrector.id': userId,
    });
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

  // todo
  async latestFeedback(userId: number): Promise<string> {
    return 'feedback';
  }

  // todo
  async evalLogSearchUrl(userId: number): Promise<string> {
    return `https://stat.42seoul.kr/evallog?corrector=jaham`;
  }
}
