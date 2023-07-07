import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { QuestsUserModule } from 'src/api/questsUser/questsUser.module';
import { DateRangeModule } from 'src/dateRange/dateRange.module';
import { HomeUserResolver } from './home.user.resolver';
import { HomeUserService } from './home.user.service';

@Module({
  imports: [CursusUserModule, QuestsUserModule, DateRangeModule],
  providers: [HomeUserResolver, HomeUserService],
})
// eslint-disable-next-line
export class HomeUserModule {}
