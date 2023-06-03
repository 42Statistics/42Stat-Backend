import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { scale_team, ScaleTeamSchema } from './db/scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

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
