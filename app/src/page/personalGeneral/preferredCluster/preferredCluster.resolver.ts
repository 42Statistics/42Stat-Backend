import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { StringDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
import { PreferredCluster } from './models/preferredCluster.model';
import { PreferredClusterService } from './preferredCluster.service';

type PreferredClusterContext = { userId: number };

@Resolver((_of: unknown) => PreferredCluster)
export class PreferredClusterResolver {
  constructor(
    private cursusUserService: CursusUserService,
    private preferredClusterService: PreferredClusterService,
  ) {}

  @Query((_returns) => PreferredCluster)
  async getPreferredCluster(
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PreferredClusterContext,
  ) {
    const cursusUser = await this.cursusUserService.findUser(userId, login);
    context.userId = cursusUser.user.id;
    return {};
  }

  @ResolveField('total', (_returns) => String)
  async total(@Context() context: PreferredClusterContext): Promise<string> {
    return await this.preferredClusterService.preferredCluster(context.userId);
  }

  @ResolveField('byDateRange', (_returns) => StringDateRanged)
  async byDateRange(
    @Context() context: PreferredClusterContext,
    @Args() dateRange: DateRangeArgs,
  ): Promise<StringDateRanged> {
    return await this.preferredClusterService.preferredClusterByDateRange(
      context.userId,
      dateRange,
    );
  }

  @ResolveField('byDateTemplate', (_returns) => StringDateRanged)
  async byDateTemplate(
    @Context() context: PreferredClusterContext,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<StringDateRanged> {
    return await this.preferredClusterService.preferredClusterByDateTemplate(
      context.userId,
      dateTemplate,
    );
  }
}
