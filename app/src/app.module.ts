import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { CursusUserModule } from './api/cursusUser/cursusUser.module';
import { ProjectModule } from './api/project/project.module';
import { ComplexityPlugin } from './apolloPlugin/ComplexityPlugin';
import { StatAuthGuard } from './auth/statAuthGuard';
import { CacheDecoratorOnReturnModule } from './cache/decrators/onReturn/cache.decorator.onReturn.module';
import { ShallowStore } from './cache/shallowStore/cache.shallowStore';
import databaseConfig from './config/configuration/database.config';
import ftClientConfig from './config/configuration/ftClient.config';
import googleClientConfig from './config/configuration/googleClient.config';
import jwtConfig from './config/configuration/jwt.config';
import timezoneConfig from './config/configuration/timezone.config';
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

@Module({
  imports: [
    //todo: appmodule에서 말고 필요한 module에서 필요한 config만 load하기
    ConfigModule.forRoot({
      // isGlobal: true,
      // cache: true,
      envFilePath: '../env/.env',
      load: [
        databaseConfig,
        ftClientConfig,
        googleClientConfig,
        jwtConfig,
        timezoneConfig,
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      store: new ShallowStore(),
    }),
    LoginModule,
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
    SettingModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      includeStacktraceInErrorResponses: process.env.PROD ? true : false,
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
