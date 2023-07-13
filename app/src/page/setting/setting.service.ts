import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LoginService } from 'src/login/login.service';
import type { Setting } from './models/setting.model';

@Injectable()
export class SettingService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly loginService: LoginService,
  ) {}

  async setting(userId: number): Promise<Setting> {
    const userLogin = await this.cursusUserService.findOneByUserId(userId);

    const { googleEmail, linkedAt } = await this.loginService.findOneAccount({
      userId,
    });

    return {
      account: {
        login: userLogin.user.login,
        googleEmail,
        linkedAt,
      },
    };
  }
}
