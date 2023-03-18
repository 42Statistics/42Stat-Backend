import { Module } from '@nestjs/common';
import { TeamsModule } from 'src/teams/teams.module';
import { TeamsService } from 'src/teams/teams.service';
import { UserResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TeamsModule],
  providers: [UserResolver, UsersService, TeamsService],
})
export class UsersModule {}
