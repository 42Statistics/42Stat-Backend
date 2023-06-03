import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';

@Module({
  imports: [
    ScaleTeamModule,
    CursusUserModule,
    QuestsUserModule,
    ScoreModule,
    DateRangeModule,
  ],
  providers: [HomeResolver, HomeService, DateRangeService],
})
export class HomeModule {}
