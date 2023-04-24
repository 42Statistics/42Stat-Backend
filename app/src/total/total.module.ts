import { Module } from '@nestjs/common';
import { QuestsUserModule } from 'src/quests_user/questsUser.module';
import { QuestsUserService } from 'src/quests_user/questsUser.service';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [ScaleTeamsModule, ScoreModule, QuestsUserModule],
  providers: [
    TotalResolver,
    TotalService,
    ScaleTeamsService,
    ScoreService,
    QuestsUserService,
  ],
})
export class TotalModule {}
