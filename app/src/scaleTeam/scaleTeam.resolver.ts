import { InternalServerErrorException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Query((_returns) => [ScaleTeam])
  async findAll(): Promise<ScaleTeam[]> {
    return await this.scaleTeamService.findAll();
  }

  @Query((_returns) => ScaleTeam)
  async findOneById(@Args('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.findOneById(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
// todo: test controller 지울 때 같이 지우도록 합시다.
  @Mutation((_returns) => ScaleTeam)
  async create(): Promise<ScaleTeam> {
    return await this.scaleTeamService.create();
    //async create(@Args('createScaleTeam') scaleTeam: ScaleTeamInput): Promise<ScaleTeam> {
    //  return await this.scaleTeamService.create(scaleTeam);
  }

  @Mutation((_returns) => ScaleTeam)
  async deleteOneById(@Args('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.deleteOneById(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
