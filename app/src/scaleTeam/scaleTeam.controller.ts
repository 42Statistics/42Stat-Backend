import { Controller, Post, Body } from '@nestjs/common';
import { ScaleTeam } from './scaleTeam.database.schema';
import { ScaleTeamService } from './scaleTeam.service';

@Controller('scaleTeam')
export class ScaleTeamController {
  constructor(private readonly scaleTeamService: ScaleTeamService) {}

  @Post()
  async create(@Body() scaleTeamData: ScaleTeam): Promise<ScaleTeam> {
    //todo: return []
    //return await this.scaleTeamService.create(scaleTeamData);
    return await this.scaleTeamService.create();
  }
}
