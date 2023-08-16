import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { LocationModule } from 'src/api/location/location.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { PersonalUtilModule } from '../util/personal.util.module';
import { PersonalVersusResolver } from './personal.versus.resolver';
import { PersonalVersusService } from './personal.versus.service';

@Module({
  imports: [
    PersonalUtilModule,
    CursusUserModule,
    ExperienceUserModule,
    ScaleTeamModule,
    ScoreModule,
    LocationModule,
  ],
  providers: [PersonalVersusResolver, PersonalVersusService],
})
// eslint-disable-next-line
export class PersonalVersusModule {}
