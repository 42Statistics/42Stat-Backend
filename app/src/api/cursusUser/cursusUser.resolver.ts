import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursusUserService } from './cursusUser.service';

@Resolver((_of: unknown) => UserPreview)
export class CursusUserResolver {
  constructor(private cursusUserService: CursusUserService) {}

  @Query((_returns) => [UserPreview], { nullable: 'items' })
  async findUserPreview(
    @Args('login', { defaultValue: '' }) login: string,
  ): Promise<UserPreview[]> {
    const users = await this.cursusUserService.findByName(login);

    return users.map(this.cursusUserService.convertToPreview);
  }
}
