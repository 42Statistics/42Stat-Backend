import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema, team } from './db/team.database.schema';
import { TeamService } from './team.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: team.name, schema: TeamSchema }]),
  ],
  providers: [TeamService],
  exports: [MongooseModule, TeamService],
})
// eslint-disable-next-line
export class TeamModule {}
