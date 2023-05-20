import { Args, Query, Resolver } from '@nestjs/graphql';
import { CursusUserService } from './cursusUser.service';
import { UserSearchPreview } from './models/cursusUser.model';

@Resolver((_of: unknown) => UserSearchPreview)
export class CursusUserResolver {
  constructor(private cursusUserService: CursusUserService) {}

  @Query((_returns) => [UserSearchPreview], { nullable: 'items' })
  async findUserPreview(
    @Args('name', { defaultValue: '' }) name: string,
  ): Promise<UserSearchPreview[]> {
    const user = await this.cursusUserService.findByName(name);

    return user.map(this.cursusUserService.convertToPreview);
  }
}
