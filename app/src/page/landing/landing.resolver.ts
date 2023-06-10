import { Query, Resolver } from '@nestjs/graphql';
import { LandingService } from './landing.service';
import { Landing } from './models/landing.model';

@Resolver((_of: unknown) => Landing)
export class LandingResolver {
  constructor(private landingService: LandingService) {}

  @Query((_returns) => Landing)
  async getLanding(): Promise<Landing> {
    return await this.landingService.landing();
  }
}
