import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { LocationModule } from 'src/api/location/location.module';
import { ProjectsUserModule } from 'src/api/projectsUser/projectsUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { PersonalGeneralCharacterService } from './personal.general.character.service';

@Module({
  imports: [
    CursusUserModule,
    ProjectsUserModule,
    QuestsUserModule,
    LocationModule,
    ScaleTeamModule,
  ],
  providers: [PersonalGeneralCharacterService],
  exports: [PersonalGeneralCharacterService],
})
// eslint-disable-next-line
export class PersonalGeneralCharacterModule {}
