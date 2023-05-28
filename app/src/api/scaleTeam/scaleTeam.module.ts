import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { scale_team, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { CursusUserService } from '../cursusUser/cursusUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: scale_team.name, schema: ScaleTeamSchema },
    ]),
    CursusUserModule,
  ],
  providers: [ScaleTeamService, CursusUserService],
  exports: [MongooseModule, ScaleTeamService, CursusUserModule],
})
export class ScaleTeamModule {}
