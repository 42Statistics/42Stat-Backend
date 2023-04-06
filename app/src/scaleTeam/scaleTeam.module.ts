import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScaleTeamController } from './scaleTeam.controller';
import { ScaleTeam, ScaleTeamSchema } from './scaleTeam.database.schema';
import { ScaleTeamResolver } from './scaleTeam.resolver';
import { ScaleTeamService } from './scaleTeam.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ScaleTeam.name, schema: ScaleTeamSchema }])],
  providers: [ScaleTeamService, ScaleTeamResolver],
  controllers: [ScaleTeamController],
  exports: [MongooseModule.forFeature([{ name: ScaleTeam.name, schema: ScaleTeamSchema }]), ScaleTeamService],
})
export class ScaleTeamModule {}
