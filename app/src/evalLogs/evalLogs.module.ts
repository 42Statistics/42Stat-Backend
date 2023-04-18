import { Module } from '@nestjs/common';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { EvalLogsResolver } from './evalLogs.resolver';
import { EvalLogsService } from './evalLogs.service';

@Module({
  imports: [ScaleTeamsModule],
  providers: [EvalLogsResolver, EvalLogsService, ScaleTeamsService],
})
// eslint-disable-next-line
export class EvalLogsModule {}
