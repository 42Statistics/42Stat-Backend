import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { LocationModule } from 'src/api/location/location.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { LambdaController } from './lambda.controller';
import { LambdaRegister } from './lambda.register';
import { LambdaService } from './lambda.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';

@Module({
  imports: [
    CacheUtilModule,
    CursusUserModule,
    ScaleTeamModule,
    ScoreModule,
    ExperienceUserModule,
    LocationModule,
    DateRangeModule,
  ],
  providers: [LambdaService, LambdaRegister],
  controllers: [LambdaController],
})
// eslint-disable-next-line
export class LambdaModule {}
