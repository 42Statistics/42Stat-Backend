import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from 'src/login/account/account.service';
import type { Setting } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(private readonly accountService: AccountService) {}

  async setting(userId: number): Promise<Setting> {
    const linkedAccounts = await this.accountService.findOneAndLean({
      filter: { userId },
    });

    if (!linkedAccounts) {
      throw new NotFoundException();
    }

    return {
      account: {
        ...linkedAccounts,
      },
    };
  }
}
