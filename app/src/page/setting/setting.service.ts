import { Injectable } from '@nestjs/common';
import { LoginService } from 'src/login/login.service';
import type { Setting } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(private readonly loginService: LoginService) {}

  async setting(userId: number): Promise<Setting> {
    const linkedAccount = await this.loginService.findOneAccount({
      userId,
    });

    //todo: test
    return {
      account: {
        ...linkedAccount,
        // userId,
        // linkedAccount: [
        //   {
        //     linkedPlatform: linkedAccount.linkedPlatform,
        //     id: linkedAccount.id,
        //     email: linkedAccount.googleEmail,
        //     linkedAt: linkedAccount.linkedAt,
        //   },
        // ],
      },
    };
  }
}
