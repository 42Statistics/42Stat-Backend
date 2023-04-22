import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { URLResolver } from 'graphql-scalars';
import { join } from 'path';
import { EvalLogsModule } from './evalLogs/evalLogs.module';
import { HomeModule } from './home/home.module';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';
import { ScaleTeamsModule } from './scaleTeams/scaleTeams.module';
import { TotalModule } from './total/total.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://rootstat:ValidPassw0rd6373@stat-mongodb-cluster.cluster-ci2xhynknqpo.ap-northeast-2.docdb.amazonaws.com:27017',
      {
        tlsCAFile: '/tmp/rds-combined-ca-bundle.pem',
        tls: true,
        replicaSet: 'rs0',
        readPreference: 'secondaryPreferred',
        retryWrites: false,
      },
    ),
    //todo: for local
    //MongooseModule.forRoot(
    //  'mongodb://42statuser:0214@host.docker.internal:27017/42stat',
    //),
    ProjectModule,
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    ScaleTeamsModule,
    EvalLogsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      resolvers: { URL: URLResolver },
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
