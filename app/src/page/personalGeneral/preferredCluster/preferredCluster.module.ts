import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUser.module';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LocationModule } from 'src/api/location/location.module';
import { LocationService } from 'src/api/location/location.service';
import { ScoreModule } from 'src/api/score/score.module';
import { ScoreService } from 'src/api/score/score.service';
import { TitlesUserModule } from 'src/api/titlesUser/titlesUser.module';
import { TitlesUserService } from 'src/api/titlesUser/titlesUser.service';
import { PersonalGeneralService } from '../personal.general.service';
import { PreferredClusterResolver } from './preferredCluster.resolver';
import { PreferredClusterService } from './preferredCluster.service';

@Module({
  imports: [
    CursusUserModule,
    LocationModule,
    TitlesUserModule,
    ScoreModule,
    CoalitionsUserModule,
  ],
  providers: [
    PreferredClusterResolver,
    PreferredClusterService,
    PersonalGeneralService,
    CursusUserService,
    LocationService,
    TitlesUserService, //todo: 정리하기 ...
    ScoreService,
    CoalitionsUserService,
  ],
})
// eslint-disable-next-line
export class PreferredClusterModule {}
