import { Module } from '@nestjs/common';
import { LoginModule } from 'src/login/login.module';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  imports: [LoginModule],
  providers: [SettingResolver, SettingService],
})
// eslint-diable-next-line
export class SettingModule {}
