import { Module } from '@nestjs/common';
import { TeamsService } from 'src/teams/teams.service';
import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UserResolver, UsersService, TeamsService],
})
export class UsersModule {}
