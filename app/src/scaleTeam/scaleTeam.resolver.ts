import { InternalServerErrorException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveReference, ResolveField } from '@nestjs/graphql';
import { ScaleTeam } from './scaleTeam.model';
import { ScaleTeamService } from './scaleTeam.service';

//@InputType()
//export class ScaleTeamInput {
//  @Field()
//  id: string;
//...
//}

@Resolver((_of: unknown) => ScaleTeam)
export class ScaleTeamResolver {
  constructor(private readonly scaleTeamService: ScaleTeamService) {}

  @Mutation((_returns) => ScaleTeam)
  async create(): Promise<ScaleTeam> {
    return await this.scaleTeamService.create();
    //async create(@Args('createScaleTeam') scaleTeam: ScaleTeamInput): Promise<ScaleTeam> {
    //  return await this.scaleTeamService.create(scaleTeam);
  }

  @Query((_returns) => ScaleTeam)
  async findOne(@Args('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.findOne(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @Mutation((_returns) => ScaleTeam)
  async deleteOne(@Args('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.deleteOne(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
