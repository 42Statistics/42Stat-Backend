import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { EvalLogModule } from './evalLog/evalLog.module';
import { HomeModule } from './home/home.module';
import { PersonalEvalModule } from './personalEval/personal.eval.module';
import { PersonalGeneralModule } from './personalGeneral/personal.general.module';
import { ProjectModule } from './project/project.module';
import { ScaleTeamModule } from './scaleTeam/scaleTeam.module';
import { TotalModule } from './total/total.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}/${process.env.DB_NAME}`,
    ),
    ScheduleModule.forRoot(),
    ProjectModule,
    HomeModule,
    TotalModule,
    PersonalGeneralModule,
    PersonalEvalModule,
    ScaleTeamModule,
    EvalLogModule,
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
