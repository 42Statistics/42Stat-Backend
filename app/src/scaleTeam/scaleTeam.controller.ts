import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ScaleTeam } from './scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

@Controller('scaleTeam')
export class ScaleTeamController {
  constructor(private readonly scaleTeamService: ScaleTeamService) {}

  @Get(':_id')
  async findOneById(@Param('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.findOneById(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  @Post()
  async create(@Body() scaleTeamData: ScaleTeam): Promise<ScaleTeam> {
    //return await this.scaleTeamService.create(scaleTeamData);
    return await this.scaleTeamService.create();
  }

  @Delete(':_id')
  async deleteOneById(@Param('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.deleteOneById(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
