import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/cursus_user/cursusUser.module';
import { QuestsUserModule } from 'src/quests_user/questsUser.module';
import { QuestsUserService } from 'src/quests_user/questsUser.service';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';
import { CoalitionsUserModule } from 'src/coalitions_user/coalitionsUser.module';

@Module({
  imports: [
    ScaleTeamModule,
    ScoreModule,
    CursusUserModule,
    QuestsUserModule,
    CoalitionsUserModule,
  ],
  providers: [
    TotalResolver,
    TotalService,
    ScaleTeamService,
    ScoreService,
    QuestsUserService,
  ],
})
export class TotalModule {}
