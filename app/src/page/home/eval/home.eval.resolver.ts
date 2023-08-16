import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeEvalService } from './home.eval.service';
import { HomeEval } from './models/home.eval.model';

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

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 60 일' })
  async evalCountRecords(@Args('last') last: number): Promise<IntRecord[]> {
    return await this.homeEvalService.evalCountRecords(
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
