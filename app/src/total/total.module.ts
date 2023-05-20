import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/cursusUser/cursusUser.module';
import { QuestsUserModule } from 'src/questsUser/questsUser.module';
import { QuestsUserService } from 'src/questsUser/questsUser.service';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';
import { CoalitionsUserModule } from 'src/coalitionsUser/coalitionsUser.module';

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
