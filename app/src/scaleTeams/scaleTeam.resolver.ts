import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ScaleTeam } from './models/scaleTeams.model';

@Resolver((_of: unknown) => ScaleTeam)
export class ScaleTeamResolver {
  @Query((_returns) => ScaleTeam)
  async getScaleTeam(@Args('id', { type: () => Int }) id: number) {}

  @ResolveField()
  async team(@Parent() scaleTeam: ScaleTeam) {}
}
