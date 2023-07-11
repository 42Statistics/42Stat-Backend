import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { experience_user } from 'src/api/experienceUser/db/experienceUser.database.schema';
import {
  ExperienceUserCacheService,
  type ExpIncreamentRankingCacheSupportedDateTemplate,
} from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateFn,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardExpService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private experienceUserService: ExperienceUserService,
    private experienceUserCacheService: ExperienceUserCacheService,
  ) {}

  rankingByDateTemplate: RankingByDateTemplateFn<
    experience_user,
    ExpIncreamentRankingCacheSupportedDateTemplate
  > = async (dateTemplate, rankingArgs) => {
    return this.leaderboardUtilService.rankingByDateTemplateImpl(
      dateTemplate,
      rankingArgs,
      () =>
        this.experienceUserCacheService.getExpIncreamentRanking(dateTemplate),
      (filter?: FilterQuery<experience_user>) =>
        this.experienceUserService.increamentRanking(filter),
    );
  };
}
