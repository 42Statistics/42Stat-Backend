import { Injectable, NotFoundException } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';

@Injectable()
export class PersonalUtilService {
  constructor(private readonly cursusUserService: CursusUserService) {}

  async selectUserId(
    myId: number,
    userId?: number,
    login?: string,
  ): Promise<number> {
    if (login) {
      const cursusUser = await this.cursusUserService.findOneAndLeanByLogin(
        login,
      );

      if (!cursusUser) {
        throw new NotFoundException();
      }

      return cursusUser.user.id;
    }

    if (userId) {
      return userId;
    }

    return myId;
  }
}
