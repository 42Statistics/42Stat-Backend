import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursusUserService } from './cursusUser.service';
import { userSearchInput } from './dtos/cursusUser.dto';

@Resolver((_of: unknown) => UserPreview)
export class CursusUserResolver {
  constructor(private readonly cursusUserService: CursusUserService) {}

  @Query((_returns) => [UserPreview])
  async findUserPreview(
    @Args() { login, limit }: userSearchInput,
  ): Promise<UserPreview[]> {
    return await this.cursusUserService.findUserPreviewByLogin(login, limit);
  }
}
