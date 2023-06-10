import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TeamModule } from 'src/api/team/team.module';
import { TeamService } from 'src/api/team/team.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { MyInfoResolver } from './myInfo.resolver';
import { MyInfoService } from './myInfo.service';

@Module({
  imports: [
    CursusUserModule,
    ExperienceUserModule,
    TeamModule,
    ScoreModule,
    ScaleTeamModule,
    QuestsUserModule,
    DateRangeModule,
  ],
  providers: [
    MyInfoResolver,
    MyInfoService,
    CursusUserService,
    ExperienceUserService,
    TeamService,
    ScoreService,
    ScaleTeamService,
    QuestsUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class MyInfoModule {}
