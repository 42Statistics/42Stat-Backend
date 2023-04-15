import { Int, ResolveField, Resolver } from '@nestjs/graphql';
import { UserProfile } from './models/personal.general.userProfile.model';

@Resolver((_of: unknown) => UserProfile)
export class UserProfileResolver {
  @ResolveField('levelRank', (_returns) => Int)
  async getLevelRank() {
    return 24;
  }
}
