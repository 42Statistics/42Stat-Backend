import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HomeCoalitionService } from './home.coalition.service';
import {
  HomeCoalition,
  IntPerCoalition,
  IntPerCoalitionDateRanged,
  ScoreRecordPerCoalition,
} from './models/home.coalition.model';

@Resolver((_of: unknown) => HomeCoalition)
export class HomeCoalitionResolver {
  constructor(private homeCoalitionService: HomeCoalitionService) {}

  @Query((_of) => HomeCoalition)
  async getHomeCoalition() {
    return {};
  }

  @ResolveField((_returns) => [IntPerCoalition])
  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.totalScoresPerCoalition();
  }

  @ResolveField((_returns) => [ScoreRecordPerCoalition])
  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    return await this.homeCoalitionService.scoreRecordsPerCoalition();
  }

  @ResolveField((_returns) => IntPerCoalitionDateRanged)
  async tigCountPerCoalitionByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntPerCoalitionDateRanged> {
    return await this.homeCoalitionService.tigCountPerCoalitionByDateTemplate(
      dateTemplate,
    );
  }
}
