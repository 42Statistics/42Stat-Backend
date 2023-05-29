import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { EvalLogModule } from './evalLog/evalLog.module';
import { ProjectModule } from './api/project/project.module';
import { ScaleTeamModule } from './api/scaleTeam/scaleTeam.module';
import { HomeModule } from './page/home/home.module';
import { PersonalEvalModule } from './page/personalEval/personal.eval.module';
import { PersonalGeneralModule } from './page/personalGeneral/personal.general.module';
import { TotalModule } from './page/total/total.module';
import { LeaderboardModule } from './page/leaderboard/leaderboard.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    ),
    ProjectModule,
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    LeaderboardModule,
    EvalLogModule,
    ScaleTeamModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
