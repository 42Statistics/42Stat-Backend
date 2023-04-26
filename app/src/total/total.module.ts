import { Module } from '@nestjs/common';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [ScaleTeamsModule, ScoreModule],
  providers: [TotalResolver, TotalService, ScaleTeamsService, ScoreService],
})
export class TotalModule {}
