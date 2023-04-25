import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { EvalLogsModule } from './evalLogs/evalLogs.module';
import { HomeModule } from './home/home.module';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';
import { ProjectModule } from './project/project.module';
import { ScaleTeamsModule } from './scaleTeams/scaleTeams.module';
import { TotalModule } from './total/total.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.TEMP_DB_HOST}:${process.env.TEMP_DB_PORT}/42stat`,
    ),
    // MongooseModule.forRoot(
    //   `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    //   {
    //     tlsCAFile: `${process.env.DB_TLS_CA_PATH}`,
    //     tls: true,
    //     replicaSet: 'rs0',
    //     readPreference: 'secondaryPreferred',
    //     retryWrites: false,
    //   },
    // ),
    ProjectModule,
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    ScaleTeamsModule,
    EvalLogsModule,
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
