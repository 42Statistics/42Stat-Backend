import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { DailyEvalCountModule } from 'src/dailyEvalCount/dailyEvalCount.module';
import { HomeEvalResolver } from './home.eval.resolver';
import { HomeEvalService } from './home.eval.service';

@Module({
  imports: [ScaleTeamModule, DailyEvalCountModule, CacheUtilModule],
  providers: [HomeEvalResolver, HomeEvalService],
})
// eslint-disable-next-line
export class HomeEvalModule {}
