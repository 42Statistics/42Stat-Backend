import { Module } from '@nestjs/common';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { ScoreModule } from 'src/score/score.module';
import { ScoreService } from 'src/score/score.service';
import { TotalResolver } from './total.resolver';
import { TotalService } from './total.service';

@Module({
  imports: [ScaleTeamModule, ScoreModule],
  providers: [TotalResolver, TotalService, ScaleTeamService, ScoreService],
})
export class TotalModule {}
