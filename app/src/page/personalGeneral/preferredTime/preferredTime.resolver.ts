import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
import {
  PreferredTimeElement,
  PreferredTimeElementDateRanged,
} from '../models/personal.general.model';
import { PreferredTime } from './models/preferredTime.model';
import { PreferredTimeService } from './preferredTime.service';

type PreferredTimeContext = { userId: number };

@Resolver((_of: unknown) => PreferredTime)
export class PreferredTimeResolver {
  constructor(
    private preferredTimeService: PreferredTimeService,
    private cursusUserService: CursusUserService,
  ) {}

  @Query((_returns) => PreferredTime)
  async getPreferredTime(
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PreferredTimeContext,
  ) {
    const cursusUser = await this.cursusUserService.findUser(userId, login);
    context.userId = cursusUser.user.id;
    return {};
  }

  @ResolveField('total', (_returns) => PreferredTimeElement)
  async total(
    @Context() context: PreferredTimeContext,
  ): Promise<PreferredTimeElement> {
    const preferredTime = await this.preferredTimeService.preferredTime(
      context.userId,
    );
    return preferredTime;
  }

  @ResolveField('byDateRange', (_returns) => PreferredTimeElementDateRanged)
  async byDateRange(
    @Context() context: PreferredTimeContext,
    @Args() dateRange: DateRangeArgs,
  ): Promise<PreferredTimeElementDateRanged> {
    return await this.preferredTimeService.preferredTimeByDateRange(
      context.userId,
      dateRange,
    );
  }

  @ResolveField('byDateTemplate', (_returns) => PreferredTimeElementDateRanged)
  async byDateTemplate(
    @Context() context: PreferredTimeContext,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredTimeElementDateRanged> {
    return await this.preferredTimeService.preferredTimeByDateTemplate(
      context.userId,
      dateTemplate,
    );
  }
}
