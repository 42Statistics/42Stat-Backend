import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ExamsModule } from './exams/exams.module';
import { ProjectsModule } from './projects/projects.module';
import { ScaleTeamsModule } from './scaleTeams/scaleTeams.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ExamsModule,
    ProjectsModule,
    TeamsModule,
    ScaleTeamsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
