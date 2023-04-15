import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { URLResolver } from 'graphql-scalars';
import { join } from 'path';
import { HomeModule } from './home/home.module';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';
import { ScaleTeamsModule } from './scaleTeams/scaleTeams.module';
import { TotalModule } from './total/total.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://42statuser:0214@host.docker.internal:27017/42stat',
    ),
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    ScaleTeamsModule,
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
