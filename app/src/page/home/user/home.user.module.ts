import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { HomeUserResolver } from './home.user.resolver';
import { HomeUserService } from './home.user.service';

@Module({
  imports: [CursusUserModule, QuestsUserModule, DateRangeModule],
  providers: [
    HomeUserResolver,
    HomeUserService,
    CursusUserService,
    QuestsUserService,
    DateRangeService,
  ],
})
// eslint-disable-next-line
export class HomeUserModule {}
