import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [],
  providers: [TeamsResolver, TeamsService, UsersService],
})
export class TeamsModule {}
