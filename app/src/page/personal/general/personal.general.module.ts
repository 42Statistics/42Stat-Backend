import { Module } from '@nestjs/common';
import { CoalitionsUserModule } from 'src/api/coalitionsUser/coalitionsUserModule';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { LocationModule } from 'src/api/location/location.module';
import { ProjectModule } from 'src/api/project/project.module';
import { ProjectsUserModule } from 'src/api/projectsUser/projectsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { TeamModule } from 'src/api/team/team.module';
import { DailyActivityModule } from 'src/dailyActivity/dailyActivity.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { PersonalUtilModule } from '../util/personal.util.module';
import { PersonalGeneralCharacterModule } from './character/persoanl.general.character.module';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [
    PersonalUtilModule,
    PersonalGeneralCharacterModule,
    ScoreModule,
    CursusUserModule,
    LocationModule,
    TeamModule,
    ScaleTeamModule,
    ProjectsUserModule,
    ProjectModule,
    ExperienceUserModule,
    CoalitionsUserModule,
    DailyActivityModule,
    DateRangeModule,
  ],
  providers: [PersonalGeneralResolver, PersonalGeneralService],
})
// eslint-disable-next-line
export class PersonalGeneralModule {}
