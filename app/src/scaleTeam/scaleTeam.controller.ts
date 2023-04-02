import { Controller, Post, Body, Get, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { ScaleTeam } from './scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

@Controller('scaleTeam')
export class ScaleTeamController {
  constructor(private readonly scaleTeamService: ScaleTeamService) {}

  @Get(':_id')
  async findOne(@Param('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.findOne(_id);
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
  async deleteOne(@Param('_id') _id: string): Promise<ScaleTeam> {
    try {
      const scaleTeam = await this.scaleTeamService.deleteOne(_id);
      return scaleTeam;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
