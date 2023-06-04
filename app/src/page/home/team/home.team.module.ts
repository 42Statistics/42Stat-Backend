import { Module } from '@nestjs/common';
import { HomeTeamResolver } from './home.team.resolver';
import { HomeTeamService } from './home.team.service';

@Module({
  imports: [],
  providers: [HomeTeamResolver, HomeTeamService],
})
// eslint-disable-next-line
export class HomeTeamModule {}
