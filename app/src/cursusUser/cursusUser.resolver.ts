import { Args, Query, Resolver } from '@nestjs/graphql';
import { CursusUserService } from './cursusUser.service';
import { UserSearchPreview } from './models/cursusUser.model';

@Resolver((_of: unknown) => UserSearchPreview)
export class CursusUserResolver {
  constructor(private cursusUserService: CursusUserService) {}

  @Query((_returns) => [UserSearchPreview], { nullable: 'items' })
  async findUserPreview(
    @Args('login', { defaultValue: '' }) login: string,
  ): Promise<UserSearchPreview[]> {
    const users = await this.cursusUserService.findByName(login);

    return users.map(this.cursusUserService.convertToPreview);
  }
}
