import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { CursusUserModule } from './api/cursusUser/cursusUser.module';
import { ProjectModule } from './api/project/project.module';
import { StatAuthGuard } from './auth/statAuthGuard';
import { ShallowStore } from './cache/shallowStore/cache.shallowStore';
import { EvalLogModule } from './page/evalLog/evalLog.module';
import { HomeModule } from './page/home/home.module';
import { LandingModule } from './page/landing/landing.module';
import { LeaderboardModule } from './page/leaderboard/leaderboard.module';
import { MyInfoModule } from './page/myInfo/myInfo.module';
import { PersonalModule } from './page/personal/personal.module';
import { ProjectInfoModule } from './page/projectInfo/projectInfo.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: new ShallowStore(),
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    ),
    ScheduleModule.forRoot(),
    CursusUserModule,
    ProjectModule,
    LandingModule,
    MyInfoModule,
    HomeModule,
    PersonalModule,
    ProjectInfoModule,
    LeaderboardModule,
    EvalLogModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      includeStacktraceInErrorResponses: false,
      driver: ApolloDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [StatAuthGuard],
})
export class AppModule {}
