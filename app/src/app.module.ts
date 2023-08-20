import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { ComplexityPlugin } from './apolloPlugin/ComplexityPlugin';
import { StatAuthGuard } from './auth/statAuthGuard';
import { CacheDecoratorOnReturnModule } from './cache/decrators/onReturn/cache.decorator.onReturn.module';
import { ShallowStore } from './cache/shallowStore/cache.shallowStore';
import { apiConfig } from './config/api';
import { cdnConfig } from './config/cdn';
import { databaseConfig } from './config/database';
import { ftClientConfig } from './config/ftClient';
import { googleClientConfig } from './config/googleClient';
import { jwtConfig } from './config/jwt';
import { timezoneConfig } from './config/timezone';
import { DateWrapper } from './dateWrapper/dateWrapper';
import { LambdaModule } from './lambda/lambda.module';
import { LoginModule } from './login/login.module';
import { EvalLogModule } from './page/evalLog/evalLog.module';
import { HomeModule } from './page/home/home.module';
import { LandingModule } from './page/landing/landing.module';
import { LeaderboardModule } from './page/leaderboard/leaderboard.module';
import { MyInfoModule } from './page/myInfo/myInfo.module';
import { PersonalModule } from './page/personal/personal.module';
import { ProjectInfoModule } from './page/projectInfo/projectInfo.module';
import { SettingModule } from './page/setting/setting.module';
import { SpotlightModule } from './page/spotlight/spotlight.module';
import { TeamInfoModule } from './page/teamInfo/teamInfo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../env/.env',
      load: [
        databaseConfig,
        ftClientConfig,
        googleClientConfig,
        jwtConfig,
        timezoneConfig,
        cdnConfig,
        apiConfig,
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      store: new ShallowStore({
        max: 100000,
        ttl: DateWrapper.MIN * 3,
      }),
    }),
    LoginModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    ),
    ScheduleModule.forRoot(),
    LandingModule,
    MyInfoModule,
    SpotlightModule,
    HomeModule,
    PersonalModule,
    ProjectInfoModule,
    TeamInfoModule,
    LeaderboardModule,
    EvalLogModule,
    SettingModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      includeStacktraceInErrorResponses: process.env.PROD ? false : true,
      driver: ApolloDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    LambdaModule,
    CacheDecoratorOnReturnModule,
  ],
  providers: [StatAuthGuard, ComplexityPlugin],
})
// eslint-disable-next-line
export class AppModule {}
