import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScaleTeam, ScaleTeamDocument } from './scaleTeam.database.schema';

@Injectable()
export class ScaleTeamService {
  constructor(@InjectModel(ScaleTeam.name) private scaleTeamModel: Model<ScaleTeamDocument>) {}

  async findAll(): Promise<ScaleTeam[]> {
    return await this.scaleTeamModel.find();
  }

  async findOneById(id: string): Promise<ScaleTeam> {
    const foundScaleTeam = await this.scaleTeamModel.findById(id).exec();
    if (!foundScaleTeam) {
      throw new NotFoundException(`scaleTeam) ${id} not found`);
    }
    return foundScaleTeam;
  }

  async create(): Promise<ScaleTeam> {
    const scaleTeamData: ScaleTeam[] = []; //todo: mock data
    const createdScaleTeam = new this.scaleTeamModel(scaleTeamData[0]);
    return await createdScaleTeam.save();
    //todo: use insertMany
    //const createdScaleTeams = await this.scaleTeamModel.insertMany(scaleTeamData);
    //return createdScaleTeams;
  }

  async deleteOneById(id: string): Promise<ScaleTeam> {
    const deletedScaleTeam = await this.scaleTeamModel.findByIdAndDelete(id);
    if (!deletedScaleTeam) {
      throw new NotFoundException(`scaleTeam) ${id} not found`);
    }
    return deletedScaleTeam;
  }
}
