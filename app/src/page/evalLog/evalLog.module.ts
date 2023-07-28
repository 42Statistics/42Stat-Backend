import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/api/project/project.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { UserModule } from 'src/api/user/user.module';
import { PaginationCursorModule } from 'src/pagination/cursor/pagination.cursor.module';
import { EvalLogResolver } from './evalLog.resolver';
import { EvalLogService } from './evalLog.service';

@Module({
  imports: [UserModule, ScaleTeamModule, ProjectModule, PaginationCursorModule],
  providers: [EvalLogResolver, EvalLogService],
})
// eslint-disable-next-line
export class EvalLogModule {}
