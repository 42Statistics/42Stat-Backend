import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';

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
