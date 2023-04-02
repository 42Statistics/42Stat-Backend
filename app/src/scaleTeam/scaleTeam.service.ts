import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScaleTeam, ScaleTeamDocument } from './scaleTeam.database.schema';

@Injectable()
export class ScaleTeamService {
  constructor(@InjectModel(ScaleTeam.name) private scaleTeamModel: Model<ScaleTeamDocument>) {}

  async create(): Promise<ScaleTeam> {
    const scaleTeamData: ScaleTeam = {
      id: 5227193,
      scale_id: 19196,
      comment:
        '2서클의 숨은 1대장 pipex평가를 마쳤습니다. 많은 우여곡절과 코딩할 때에 애로사항들을 공유해주셨고, 저도 minishell에서 발생할 수 있는 잠재적 에러군을 알려드릴 수 있어서 서로 유익한 평가가 될 수 있었다고 생각합니다. 여러가지 상황에 대한 처리를 더욱 꼼꼼히 다지셔서 minishell에서 어려움 없이 해결해나가시길 바라겠습니다 고생하셨습니다. :DD',
      created_at: '2023-04-01T09:42:17.700Z',
      updated_at: '2023-04-01T11:33:56.182Z',
      feedback: null,
      final_mark: 125,
      flag: {
        id: 1,
        name: 'Ok',
        positive: true,
      },
      begin_at: '2023-04-01T10:45:00.000Z',
      correcteds: [
        {
          id: 131755,
          login: 'mingekim',
        },
      ],
      corrector: {
        id: 112196,
        login: 'younhwan',
      },
      filled_at: '2023-04-01T11:33:56.170Z',
      scale: {
        id: 19196,
        evaluation_id: 4722,
        is_primary: true,
        comment: '',
        created_at: '2022-12-01T04:25:52.223Z',
        correction_number: 3,
        duration: 1800,
        manual_subscription: true,
        flags: [
          {
            id: 1,
            name: 'Ok',
            positive: true,
          },
          {
            id: 2,
            name: 'Empty work',
            positive: false,
          },
          {
            id: 3,
            name: 'Incomplete work',
            positive: false,
          },
          {
            id: 5,
            name: 'Invalid compilation',
            positive: false,
          },
          {
            id: 6,
            name: 'Norme',
            positive: false,
          },
          {
            id: 7,
            name: 'Cheat',
            positive: false,
          },
          {
            id: 8,
            name: 'Crash',
            positive: false,
          },
          {
            id: 9,
            name: 'Outstanding project',
            positive: true,
          },
          {
            id: 11,
            name: 'Concerning situation',
            positive: false,
          },
          {
            id: 12,
            name: 'Leaks',
            positive: false,
          },
          {
            id: 13,
            name: 'Forbidden Function',
            positive: false,
          },
        ],
        free: false,
      },
      team: {
        id: 4751291,
        name: "mingekim's group",
        url: 'https://api.intra.42.fr/v2/teams/4751291',
        final_mark: null,
        project_id: 2004,
        created_at: '2023-03-13T06:36:05.907Z',
        updated_at: '2023-04-01T11:33:56.363Z',
        status: 'waiting_for_correction',
        terminating_at: null,
        users: [
          {
            id: 131755,
            login: 'mingekim',
            url: 'https://api.intra.42.fr/v2/users/mingekim',
            leader: true,
            occurrence: 0,
            validated: true,
            projects_user_id: 3024673,
          },
        ],
        locked: true,
        validate: null,
        close: true,
        locked_at: '2023-03-13T06:36:05.951Z',
        closed_at: '2023-04-01T05:35:24.928Z',
        project_session_id: 6962,
      },
      feedbacks: [],
    };
    const createdScaleTeam = new this.scaleTeamModel(scaleTeamData);
    return await createdScaleTeam.save();
  }
}
