import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { ComplexityPlugin } from './apolloPlugin/ComplexityPlugin';
import { StatAuthGuard } from './auth/statAuthGuard';
import { CacheDecoratorOnReturnModule } from './cache/decrators/onReturn/cache.decorator.onReturn.module';
import { ShallowStore } from './cache/shallowStore/cache.shallowStore';
import { API_CONFIG } from './config/api';
import { CDN_CONFIG } from './config/cdn';
import { DATABASE_CONFIG } from './config/database';
import { FT_CLIENT_CONFIG } from './config/ftClient';
import { GOOGLE_CLIENT_CONFIG } from './config/googleClient';
import { JWT_CONFIG } from './config/jwt';
import { RUNTIME_CONFIG } from './config/runtime';
import { MongooseRootModule } from './database/mongoose/database.mongoose.module';
import { DateWrapper } from './dateWrapper/dateWrapper';
import { LambdaModule } from './lambda/lambda.module';
import { LoginModule } from './login/login.module';
import { CalculatorModule } from './page/calculator/calculator.module';
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
      envFilePath: ['../env/.env.prod', '../env/.env.dev', '../env/.env.local'],
      load: [
        DATABASE_CONFIG,
        FT_CLIENT_CONFIG,
        GOOGLE_CLIENT_CONFIG,
        JWT_CONFIG,
        RUNTIME_CONFIG,
        CDN_CONFIG,
        API_CONFIG,
      ],
    }),
    MongooseRootModule,
    CacheModule.register({
      isGlobal: true,
      store: new ShallowStore({
        max: 100000,
        ttl: DateWrapper.MIN * 3,
      }),
    }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      inject: [RUNTIME_CONFIG.KEY],
      driver: ApolloDriver,
      useFactory: (runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>) => {
        return {
          includeStacktraceInErrorResponses: runtimeConfig.PROD ? false : true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        };
      },
    }),
  ],
})
// eslint-disable-next-line
export class AppRootModule {}

@Module({
  imports: [
    AppRootModule,
    LoginModule,
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
    CalculatorModule,
    LambdaModule,
    CacheDecoratorOnReturnModule,
  ],
  providers: [StatAuthGuard, ComplexityPlugin],
})
// eslint-disable-next-line
export class AppModule {}
