import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { join } from 'path';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';
import { HomeModule } from './home/home.module';
import { TotalModule } from './total/total.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EvalLogModule } from './evalLog/evalLog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://user:0214@db:27017/42stat'),
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    EvalLogModule,
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
