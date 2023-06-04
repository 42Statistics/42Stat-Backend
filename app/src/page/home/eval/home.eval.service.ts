import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import type {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class HomeEvalService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private dateRangeService: DateRangeService,
  ) {}

  async evalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    return await this.scaleTeamService.evalCount(filter);
  }

  async evalCountByDateRange(dateRange: DateRange): Promise<IntDateRanged> {
    const evalFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      filledAt: { $ne: null },
    };

    const evalCount = await this.evalCount(evalFilter);

    return this.dateRangeService.toDateRanged(evalCount, dateRange);
  }

  async evalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.evalCountByDateRange(dateRange);
  }

  async averageEvalCountByDateRange(
    dateRange: DateRange,
  ): Promise<FloatDateRanged> {
    return this.dateRangeService.toDateRanged(1.11, dateRange);
  }

  async averageEvalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<FloatDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.averageEvalCountByDateRange(dateRange);
  }

  async averageFeedbackLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback');
  }

  async averageCommentLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment');
  }
}
