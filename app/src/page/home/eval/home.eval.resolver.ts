import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeEvalService } from './home.eval.service';
import { HomeEval } from './models/home.eval.model';
import {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeEval)
export class HomeEvalResolver {
  constructor(private readonly homeEvalService: HomeEvalService) {}

  @Query((_of) => HomeEval)
  async getHomeEval() {
    return {};
  }

  @ResolveField((_returns) => Int)
  async totalEvalCount(): Promise<number> {
    return await this.homeEvalService.totalEvalCount();
  }

  @ResolveField((_returns) => IntDateRanged, {
    deprecationReason:
      'v0.6.0: 기획 변경: 전체 기간 평가 기록은 totalEvalCount 를 사용하세요.',
  })
  async evalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntDateRanged> {
    return await this.homeEvalService.evalCountByDateTemplate(dateTemplate);
  }

  @ResolveField((_returns) => FloatDateRanged, { deprecationReason: '0.6.0' })
  async averageEvalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<FloatDateRanged> {
    return await this.homeEvalService.averageEvalCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 60 일' })
  async evalCountRecord(@Args('last') last: number): Promise<IntRecord[]> {
    return await this.homeEvalService.evalCountRecord(
      Math.max(Math.min(last, 60), 1),
    );
  }

  @ResolveField((_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeEvalService.averageFeedbackLength();
  }

  @ResolveField((_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeEvalService.averageCommentLength();
  }
}
