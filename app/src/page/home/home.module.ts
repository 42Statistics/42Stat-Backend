import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [ScaleTeamModule, CursusUserModule, QuestsUserModule, ScoreModule],
  providers: [HomeResolver, HomeService],
})
export class HomeModule {}
