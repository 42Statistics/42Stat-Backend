import { Module } from '@nestjs/common';
import { TeamModule } from 'src/api/team/team.module';
import { TeamInfoResolver } from './teamInfo.resolver';
import { TeamInfoService } from './teamInfo.service';

@Module({
  imports: [TeamModule],
  providers: [TeamInfoResolver, TeamInfoService],
})
// eslint-disable-next-line
export class TeamInfoModule {}
