import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HomeEvalService } from './home.eval.service';
import { HomeEval } from './models/home.eval.model';

@Resolver((_of: unknown) => HomeEval)
export class HomeEvalResolver {
  constructor(private homeEvalService: HomeEvalService) {}

  @Query((_of) => HomeEval)
  async getHomeEval() {
    return {};
  }

  @ResolveField('totalEvalCount', (_returns) => Int)
  async evalCount(): Promise<number> {
    return await this.homeEvalService.evalCount();
  }

  @ResolveField('evalCountByDateTemplate', (_returns) => IntDateRanged)
  async evalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntDateRanged> {
    return await this.homeEvalService.evalCountByDateTemplate(dateTemplate);
  }

  @ResolveField('averageEvalCountByDateTemplate', (_returns) => FloatDateRanged)
  async averageEvalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<FloatDateRanged> {
    return await this.homeEvalService.averageEvalCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField('averageFeedbackLength', (_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeEvalService.averageFeedbackLength();
  }

  @ResolveField('averageCommentLength', (_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeEvalService.averageCommentLength();
  }
}
