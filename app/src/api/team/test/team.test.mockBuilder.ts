import { TeamStatus } from 'src/page/teamInfo/models/teamInfo.status.model';
import type { TeamUser } from '../db/team.database.base.schema';
import type { TeamScaleTeam, team } from '../db/team.database.schema';

const DEFAULT_TEAM: team = {
  id: 3875356,
  name: "jaham's group",
  url: 'https://api.intra.42.fr/v2/teams/3875356',
  finalMark: 125,
  projectId: 1314,
  createdAt: new Date('2021-11-09T17:20:01.960Z'),
  updatedAt: new Date('2021-11-15T16:44:41.761Z'),
  status: 'finished',
  'locked?': true,
  'validated?': true,
  'closed?': true,
  lockedAt: new Date('2021-11-09T17:20:02.002Z'),
  closedAt: new Date('2021-11-15T10:57:50.978Z'),
  projectSessionId: 3300,
  users: [
    {
      id: 99947,
      login: 'jaham',
      url: 'https://api.intra.42.fr/v2/users/jaham',
      leader: true,
      occurrence: 0,
      validated: true,
      projectsUserId: 2403029,
    },
  ],
  teamsUploads: [
    {
      id: 1247509,
      finalMark: 125,
      comment:
        'initial_errors:  | test_ft_isalnum: OK | test_ft_isalpha: OK | test_ft_isascii: OK | test_ft_isdigit: OK | test_ft_isprint: OK | test_ft_atoi: OK | test_ft_bzero: OK | test_ft_calloc: OK | test_ft_itoa: OK | test_ft_memchr: OK | test_ft_memcmp: OK | test_ft_memcpy: OK | test_ft_memmove: OK | test_ft_memset: OK | test_ft_putchar_fd: OK | test_ft_putendl_fd: OK | test_ft_putnbr_fd: OK | test_ft_putstr_fd: OK | test_ft_split: OK | test_ft_strchr: OK | test_ft_strdup: OK | test_ft_strjoin: OK | test_ft_strlcat: OK | test_ft_strlcpy: OK | test_ft_strlen: OK | test_ft_strmapi: OK | test_ft_striteri: OK | test_ft_strncmp: OK | test_ft_strnstr: OK | test_ft_strrchr: OK | test_ft_strtrim: OK | test_ft_substr: OK | test_ft_tolower: OK | test_ft_toupper: OK | bonus: 9/9 functions correct',
      createdAt: new Date('2021-11-15T16:44:41.758Z'),
      uploadId: 327,
    },
  ],
  scaleTeams: [
    {
      id: 3712888,
      scaleId: 9515,
      comment:
        '늦은 시간까지 수고가 많으십니다!!! 코드 스타일이 깔끔하고 좋은 것 같아요!! 가독성이 좋아요!!!',
      createdAt: new Date('2021-11-15T15:58:46.819Z'),
      updatedAt: new Date('2021-11-15T16:43:47.981Z'),
      feedback:
        '필요한 부분 꼼꼼하게 봐주셔서 감사합니다! 같이 블랙홀 안들어가게 열심히 해요!',
      finalMark: 125,
      flag: {
        id: 1,
        name: 'Ok',
        positive: true,
        icon: 'check-4',
        createdAt: new Date('2015-09-14T23:06:52.000Z'),
        updatedAt: new Date('2015-09-14T23:06:52.000Z'),
      },
      beginAt: new Date('2021-11-15T16:30:00.000Z'),
      correcteds: [
        {
          id: 99947,
          login: 'jaham',
          url: 'https://api.intra.42.fr/v2/users/jaham',
        },
      ],
      corrector: {
        id: 87067,
        login: 'mhong',
        url: 'https://api.intra.42.fr/v2/users/mhong',
      },
      filledAt: new Date('2021-11-15T16:41:01.155Z'),
    },
    {
      id: 3711781,
      scaleId: 9515,
      comment:
        '너무 긴 평가였고 시간도 늦었는데 친절하고 아주 멋지게 설명을 잘해주셨습니다!!! 배울점 많은 평가였습니다 감사합니다!!',
      createdAt: new Date('2021-11-15T10:58:56.930Z'),
      updatedAt: new Date('2021-11-15T15:56:35.917Z'),
      feedback:
        '긴 평가 주의깊게 들어주셔서 좋았습니다. 하나하나 짚어가면서 꼼꼼하게 확인하는 좋은 시간이였네요~',
      finalMark: 125,
      flag: {
        id: 9,
        name: 'Outstanding project',
        positive: true,
        icon: 'star-1',
        createdAt: new Date('2017-05-18T14:07:37.380Z'),
        updatedAt: new Date('2017-05-18T14:12:07.415Z'),
      },
      beginAt: new Date('2021-11-15T11:30:00.000Z'),
      correcteds: [
        {
          id: 99947,
          login: 'jaham',
          url: 'https://api.intra.42.fr/v2/users/jaham',
        },
      ],
      corrector: {
        id: 98380,
        login: 'jajeong',
        url: 'https://api.intra.42.fr/v2/users/jajeong',
      },
      filledAt: new Date('2021-11-15T15:54:33.105Z'),
    },
    {
      id: 3711920,
      scaleId: 9515,
      comment: '코드가 전체적으로 가독성이 좋고, 잘 설명해주셨습니다. ',
      createdAt: new Date('2021-11-15T11:11:02.651Z'),
      updatedAt: new Date('2021-11-15T13:37:01.132Z'),
      feedback:
        '본과정 첫 평가라 긴장이 많이 됐었는데, 친절하게 잘 짚어가며 말씀해주셔서 무사히 잘 마쳤습니다. 질문도 잘 받아주셔서 너무 감사했습니다!',
      finalMark: 125,
      flag: {
        id: 9,
        name: 'Outstanding project',
        positive: true,
        icon: 'star-1',
        createdAt: new Date('2017-05-18T14:07:37.380Z'),
        updatedAt: new Date('2017-05-18T14:12:07.415Z'),
      },
      beginAt: new Date('2021-11-15T12:15:00.000Z'),
      correcteds: [
        {
          id: 99947,
          login: 'jaham',
          url: 'https://api.intra.42.fr/v2/users/jaham',
        },
      ],
      corrector: {
        id: 79664,
        login: 'tyou',
        url: 'https://api.intra.42.fr/v2/users/tyou',
      },
      filledAt: new Date('2021-11-15T12:43:21.496Z'),
    },
  ],
  projectGitlabPath: 'pedago_world/42-cursus/inner-circle/libft',
  repoUrl:
    'git@vogsphere.42seoul.kr:vogsphere/intra-uuid-3638a7f8-b22d-4141-be1e-ec5f673a6aeb-3875356',
  repoUuid: 'intra-uuid-3638a7f8-b22d-4141-be1e-ec5f673a6aeb-3875356',
};

export class TeamMockBuilder {
  private readonly teamObject: team;

  constructor(team?: Partial<team>) {
    this.teamObject = {
      ...DEFAULT_TEAM,
      ...team,
    };
  }

  setUsers(teamUsers: TeamUser[]): TeamMockBuilder {
    if (!teamUsers.length) {
      throw Error('wrong team users');
    }

    this.teamObject.users = teamUsers;

    return this;
  }

  setScaleTeams(teamScaleTeams: TeamScaleTeam[]): TeamMockBuilder {
    this.teamObject.scaleTeams = teamScaleTeams;

    return this;
  }

  setTeamStatus(
    state: Exclude<TeamStatus, TeamStatus.FINISHED>,
    date: Date,
  ): TeamMockBuilder {
    switch (state) {
      case TeamStatus.REGISTERED:
        this.teamObject.createdAt = date;
        return this;
      case TeamStatus.IN_PROGRESS:
        this.teamObject['locked?'] = true;
        this.teamObject.lockedAt = date;
        return this;
      case TeamStatus.WAITING_FOR_CORRECTION:
        this.teamObject['closed?'] = true;
        this.teamObject.closedAt = date;
        return this;
    }
  }

  toTeam(): team {
    if (!this.teamObject.users.length) {
      throw Error('유저를 한명 이상 설정해야함');
    }

    return this.teamObject;
  }

  static generateUser(
    teamUser: Partial<TeamUser> & Pick<TeamUser, 'id'>,
  ): TeamUser {
    return {
      leader: false,
      occurrence: 0,
      validated: false,
      projectsUserId: 0,
      login: '',
      url: '',
      ...teamUser,
    };
  }
}
