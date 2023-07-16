import { Injectable } from '@nestjs/common';
import { LoginService } from 'src/login/login.service';
import type { Setting } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(private readonly loginService: LoginService) {}

  async setting(userId: number): Promise<Setting> {
    const { googleEmail, linkedAt } = await this.loginService.findOneAccount({
      userId,
    });

    return {
      account: {
        googleEmail,
        linkedAt,
      },
    };
  }
}
