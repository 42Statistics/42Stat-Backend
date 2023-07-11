import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';

@Injectable()
export class PersonalUtilService {
  constructor(private cursusUserService: CursusUserService) {}

  async selectUserId(
    myId: number,
    userId?: number,
    login?: string,
  ): Promise<number> {
    try {
      if (login) {
        const cursusUser = await this.cursusUserService.findOneByLogin(login);

        return cursusUser.user.id;
      }

      if (userId) {
        return userId;
      }

      return myId;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
}
