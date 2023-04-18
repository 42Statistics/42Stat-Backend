import { Module } from '@nestjs/common';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { EvalLogsResolver } from './evalLogs.resolver';
import { EvalLogsService } from './evalLogs.service';
import { ProjectModule } from 'src/project/project.module';
import { ProjectService } from 'src/project/project.service';

@Module({
  imports: [ScaleTeamsModule, ProjectModule],
  providers: [
    EvalLogsResolver,
    EvalLogsService,
    ScaleTeamsService,
    ProjectService,
  ],
})
// eslint-disable-next-line
export class EvalLogsModule {}
