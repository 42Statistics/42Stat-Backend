import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HomeCoalitionService } from './home.coalition.service';
import {
  HomeCoalition,
  ScoreRecordPerCoalition,
  ValuePerCoalition,
} from './models/home.coalition.model';

@Resolver((_of: unknown) => HomeCoalition)
export class HomeCoalitionResolver {
  constructor(private homeCoalitionService: HomeCoalitionService) {}

  @Query((_of) => HomeCoalition)
  async getHomeCoalition() {
    return {};
  }

  @ResolveField('totalScoresPerCoalition', (_returns) => [ValuePerCoalition])
  async totalScores(): Promise<ValuePerCoalition[]> {
    return await this.homeCoalitionService.totalScoresPerCoalition();
  }

  @ResolveField('scoreRecordsPerCoalition', (_returns) => [
    ScoreRecordPerCoalition,
  ])
  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    return await this.homeCoalitionService.scoreRecordsPerCoalition();
  }

  @ResolveField('tigCountPerCoalitions', (_returns) => [ValuePerCoalition])
  async tigCountPerCoalitions(): Promise<ValuePerCoalition[]> {
    return await this.homeCoalitionService.tigCountPerCoalitions();
  }
}
