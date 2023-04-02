import { Controller, Post, Body, Get } from '@nestjs/common';
import { ScaleTeam } from './scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

@Controller('eval-logs')
export class ScaleTeamController {
  constructor(private readonly scaleTeamService: ScaleTeamService) {}

  @Get()
  async testMethod() {
    console.log('get');
  }

  @Post()
  async create(@Body() scaleTeamData: ScaleTeam): Promise<ScaleTeam> {
    //return await this.scaleTeamService.create(scaleTeamData);
    return await this.scaleTeamService.create();
  }
}
