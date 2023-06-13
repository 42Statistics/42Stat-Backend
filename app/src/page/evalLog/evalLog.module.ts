import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ProjectModule } from 'src/api/project/project.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { PaginationCursorModule } from 'src/pagination/cursor/pagination.cursor.module';
import { EvalLogResolver } from './evalLog.resolver';
import { EvalLogService } from './evalLog.service';

@Module({
  imports: [
    ScaleTeamModule,
    ProjectModule,
    CursusUserModule,
    PaginationCursorModule,
  ],
  providers: [EvalLogResolver, EvalLogService],
})
// eslint-disable-next-line
export class EvalLogModule {}
