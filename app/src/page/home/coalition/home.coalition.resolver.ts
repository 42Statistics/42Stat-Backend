import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HomeCoalitionService } from './home.coalition.service';
import {
  HomeCoalition,
  ScoreRecordPerCoalition,
  IntPerCoalition,
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

  @ResolveField((_returns) => [IntPerCoalition])
  async tigCountPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.tigCountPerCoalition();
  }
}
