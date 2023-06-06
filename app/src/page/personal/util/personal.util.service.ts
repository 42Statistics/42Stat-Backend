import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';

@Injectable()
export class PersonalUtilService {
  constructor(private cursusUserService: CursusUserService) {}

  async selectUserId<T extends { userId: number }>(
    context: T,
    login?: string,
    userId?: number,
  ): Promise<number> {
    if (login) {
      const cursusUser = await this.cursusUserService.findOneByLogin(login);

      return cursusUser.user.id;
    }

    if (userId) {
      return userId;
    }

    return context.userId;
  }
}
