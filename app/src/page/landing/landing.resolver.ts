import { UseFilters } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { LandingService } from './landing.service';
import { Landing } from './models/landing.model';

@UseFilters(HttpExceptionFilter)
@Resolver((_of: unknown) => Landing)
export class LandingResolver {
  constructor(private readonly landingService: LandingService) {}

  @Query((_returns) => Landing)
  async getLanding(): Promise<Landing> {
    return await this.landingService.landing();
  }
}
