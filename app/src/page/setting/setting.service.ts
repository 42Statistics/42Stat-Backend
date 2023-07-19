import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/api/account/account.service';
import type { Setting } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(private readonly accountService: AccountService) {}

  async setting(userId: number): Promise<Setting> {
    const linkedAccount = await this.accountService.findOne({
      userId,
    });

    return {
      account: {
        ...linkedAccount,
      },
    };
  }
}
