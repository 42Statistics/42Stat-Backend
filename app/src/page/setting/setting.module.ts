import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { LoginModule } from 'src/login/login.module';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  imports: [CursusUserModule, LoginModule],
  providers: [SettingResolver, SettingService],
})
// eslint-diable-next-line
export class SettingModule {}
