import { UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { Setting } from './models/setting.model';
import { SettingService } from './setting.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Query((_returns) => Setting)
  async getSetting(@MyUserId() myUserId: number): Promise<Setting> {
    return await this.settingService.setting(myUserId);
  }
}
