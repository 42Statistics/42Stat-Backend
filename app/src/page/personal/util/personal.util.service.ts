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
      const cursusUser: { user: { id: number } } | null =
        await this.cursusUserService.findOneAndLean({
          filter: { 'user.login': login },
          select: { 'user.id': 1 },
        });

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
