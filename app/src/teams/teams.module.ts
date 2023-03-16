import { Module } from '@nestjs/common';
import { TeamResolver } from './team.resolver';

@Module({
  imports: [],
  providers: [TeamResolver],
})
export class TeamsModule {}
