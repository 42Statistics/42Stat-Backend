import { Module } from '@nestjs/common';
import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [],
  providers: [TeamsResolver, TeamsService],
})
export class TeamsModule {}
