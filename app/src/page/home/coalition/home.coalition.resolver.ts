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

  @ResolveField('totalScoresPerCoalition', (_returns) => [IntPerCoalition])
  async totalScores(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.totalScoresPerCoalition();
  }

  @ResolveField('scoreRecordsPerCoalition', (_returns) => [
    ScoreRecordPerCoalition,
  ])
  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    return await this.homeCoalitionService.scoreRecordsPerCoalition();
  }

  @ResolveField('tigCountPerCoalitions', (_returns) => [IntPerCoalition])
  async tigCountPerCoalitions(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.tigCountPerCoalitions();
  }
}
