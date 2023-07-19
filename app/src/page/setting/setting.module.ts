import { Module } from '@nestjs/common';
import { AccountModule } from 'src/api/account/account.module';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  imports: [AccountModule],
  providers: [SettingResolver, SettingService],
})
// eslint-diable-next-line
export class SettingModule {}
