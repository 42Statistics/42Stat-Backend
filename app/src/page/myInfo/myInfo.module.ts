import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ExperienceUserModule } from 'src/api/experienceUser/experienceUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { ScaleTeamModule } from 'src/api/scaleTeam/scaleTeam.module';
import { ScoreModule } from 'src/api/score/score.module';
import { TeamModule } from 'src/api/team/team.module';
import { UserModule } from 'src/api/user/user.module';
import { MyInfoResolver } from './myInfo.resolver';
import { MyInfoService } from './myInfo.service';

@Module({
  imports: [
    CursusUserModule,
    ExperienceUserModule,
    TeamModule,
    ScoreModule,
    ScaleTeamModule,
    QuestsUserModule,
    UserModule,
  ],
  providers: [MyInfoResolver, MyInfoService],
})
// eslint-disable-next-line
export class MyInfoModule {}
