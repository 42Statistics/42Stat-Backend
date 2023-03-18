import { ObjectType } from '@nestjs/graphql';
import { ScaleTeamBase } from 'src/scaleTeams/models/scaleTeam.base.model';

@ObjectType()
export class TeamScaleTeamPartial extends ScaleTeamBase {}
