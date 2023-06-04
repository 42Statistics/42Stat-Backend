import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CursusUserModule } from './api/cursusUser/cursusUser.module';
import { ProjectModule } from './api/project/project.module';
import { EvalLogModule } from './page/evalLog/evalLog.module';
import { HomeModule } from './page/home/home.module';
import { LeaderboardModule } from './page/leaderboard/leaderboard.module';
import { PersonalEvalModule } from './page/personalEval/personal.eval.module';
import { PersonalGeneralModule } from './page/personalGeneral/personal.general.module';
import { ProjectInfoModule } from './page/projectInfo/projectInfo.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    ),
    CursusUserModule,
    ProjectModule,
    HomeModule,
    LeaderboardModule,
    EvalLogModule,
    ProjectInfoModule,
    PersonalGeneralModule,
    PersonalEvalModule,
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
