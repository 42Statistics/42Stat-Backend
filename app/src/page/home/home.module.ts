import { Module } from '@nestjs/common';
import { HomeCoalitionModule } from './coalition/home.coalition.module';
import { HomeEvalModule } from './eval/home.eval.module';
import { HomeTeamModule } from './team/home.team.module';
import { HomeUserModule } from './user/home.user.module';

@Module({
  imports: [
    HomeUserModule,
    HomeEvalModule,
    HomeCoalitionModule,
    HomeTeamModule,
  ],
})
// eslint-disable-next-line
export class HomeModule {}
