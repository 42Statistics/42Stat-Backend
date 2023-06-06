import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursusUserService } from './cursusUser.service';

@Resolver((_of: unknown) => UserPreview)
export class CursusUserResolver {
  constructor(private cursusUserService: CursusUserService) {}

  @Query((_returns) => [UserPreview], { nullable: 'items' })
  async findUserPreview(
    @Args('login', { defaultValue: '' }) login: string,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<UserPreview[]> {
    return await this.cursusUserService.findUserPreviewByLogin(login, limit);
  }
}
