import {
  InjectModel,
  MongooseModule,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AppRootModule } from 'src/app.module';
import {
  type UserRank,
  userRankSchema,
} from 'src/common/models/common.user.model';
import {
  type TeamScaleTeam,
  team as original_team,
} from '../db/team.database.schema';
import { TeamService } from '../team.service';
import { TeamMockBuilder } from './team.test.mockBuilder';

describe('team service', () => {
  const userId1 = 99947;
  const userId2 = 68910;
  const userId3 = 68942;

  let teamModuleRef: TestingModule;

  let teamService: TeamService;
  let teamModel: Model<original_team>;

  @Schema({ collection: 'test_teams' })
  class team extends original_team {}

  class TeamModelService {
    constructor(
      @InjectModel(team.name)
      readonly teamModel: Model<team>,
    ) {}
  }

  const testTeamSchema = SchemaFactory.createForClass(team);

  beforeAll(async () => {
    teamModuleRef = await Test.createTestingModule({
      imports: [
        AppRootModule,
        MongooseModule.forFeature([
          { schema: testTeamSchema, name: team.name },
        ]),
      ],
      providers: [TeamService, TeamModelService],
    }).compile();

    teamService = teamModuleRef.get(TeamService);
    teamModel = teamModuleRef.get(TeamModelService).teamModel;
  });

  afterAll(async () => {
    await teamModel.collection.drop();
    await teamModuleRef.close();
  });

  describe('destiny ranking', () => {
    const destinyRankingByTeamInfo = (
      userId: number,
      team: team,
    ): Promise<UserRank[]> => {
      return teamService.destinyRanking(
        userId,
        team.scaleTeams.length + team.users.length,
      );
    };

    afterEach(async () => {
      await teamModel.deleteMany({});
    });

    it('UserRank[] 를 반환', async () => {
      const teamUser = TeamMockBuilder.generateUser({
        id: userId1,
      });

      const team = new TeamMockBuilder().setUsers([teamUser]).toTeam();

      if (!team.scaleTeams.length) {
        throw Error('한개 이상의 TeamScaleTeam 을 설정해야함');
      }

      await teamModel.insertMany([team] satisfies team[]);

      const destinyRanking = await destinyRankingByTeamInfo(teamUser.id, team);

      expect(destinyRanking.length).toBeGreaterThan(0);

      const parseResults = await Promise.all(
        destinyRanking.map((userRank) =>
          userRankSchema.safeParseAsync(userRank),
        ),
      );

      expect(parseResults.find((parseResult) => !parseResult.success)).toBe(
        undefined,
      );
    });

    it('자기 자신을 반환하지 않음', async () => {
      const teamUser = TeamMockBuilder.generateUser({
        id: userId1,
      });

      const team = new TeamMockBuilder().setUsers([teamUser]).toTeam();

      if (!team.scaleTeams.length) {
        throw Error('한개 이상의 TeamScaleTeam 을 설정해야함');
      }

      await teamModel.insertMany([team] satisfies team[]);

      const destinyRanking = await destinyRankingByTeamInfo(teamUser.id, team);

      expect(findUserRankByUserId(destinyRanking, teamUser.id)?.value).toBe(
        undefined,
      );
    });

    it('피평가자일때, 평가자에게 1점 추가', async () => {
      const teamUser = TeamMockBuilder.generateUser({ id: userId1 });
      const team = new TeamMockBuilder().setUsers([teamUser]).toTeam();

      if (!team.scaleTeams.length) {
        throw Error('한개 이상의 TeamScaleTeam 을 설정해야함');
      }

      await teamModel.insertMany([team] satisfies team[]);

      const destinyRanking = await destinyRankingByTeamInfo(teamUser.id, team);

      team.scaleTeams.forEach(({ corrector }) =>
        expect(findUserRankByUserId(destinyRanking, corrector.id)?.value).toBe(
          1,
        ),
      );
    });

    it('피평가자일때, 자신을 제외한 모든 팀원들에게 1점 추가', async () => {
      const user1 = TeamMockBuilder.generateUser({ id: userId1 });
      const user2 = TeamMockBuilder.generateUser({ id: userId2 });
      const user3 = TeamMockBuilder.generateUser({ id: userId3 });

      const team = new TeamMockBuilder()
        .setUsers([user1, user2, user3])
        .setScaleTeams([])
        .toTeam();

      await teamModel.insertMany([team] satisfies team[]);

      const destinyRanking = await destinyRankingByTeamInfo(user1.id, team);

      team.users.forEach((user) => {
        if (user.id === user1.id) {
          return;
        }

        expect(findUserRankByUserId(destinyRanking, user2.id)?.value).toBe(1);
        expect(findUserRankByUserId(destinyRanking, user3.id)?.value).toBe(1);
      });
    });

    it('평가자일때, 평가받는 모든 팀원들에게 1점 추가', async () => {
      const corrector = {
        id: userId1,
        login: 'jaham',
        url: '',
      };

      const leaderTeamUser = TeamMockBuilder.generateUser({
        id: userId2,
        leader: true,
      });

      const normalTeamUser = TeamMockBuilder.generateUser({
        leader: false,
        id: userId3,
      });

      const teamScaleTeam: TeamScaleTeam = {
        id: 0,
        scaleId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        beginAt: new Date(),
        correcteds: [],
        corrector,
        flag: {
          id: 0,
          name: '',
          positive: false,
          icon: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const team = new TeamMockBuilder()
        .setUsers([leaderTeamUser, normalTeamUser])
        .setScaleTeams([teamScaleTeam])
        .toTeam();

      await teamModel.insertMany([team] satisfies team[]);

      const destinyRanking = await destinyRankingByTeamInfo(userId1, team);

      expect(
        findUserRankByUserId(destinyRanking, leaderTeamUser.id)?.value,
      ).toBe(1);

      expect(
        findUserRankByUserId(destinyRanking, normalTeamUser.id)?.value,
      ).toBe(1);
    });
  });
});

// todo: 위치 이동?
const findUserRankByUserId = (
  userRanking: UserRank[],
  userId: number,
): UserRank | undefined => {
  return userRanking.find(({ userPreview }) => userPreview.id === userId);
};
