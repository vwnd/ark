import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphQLContext } from './context';
import { GraphQLLoggerPlugin } from './plugins/graphql-logger.plugin';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'dist/schema.gql'),
      introspection: true,
      driver: ApolloDriver,
      playground: false,
      context: ({ req, res }): GraphQLContext => ({ req, res }),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        new GraphQLLoggerPlugin(),
      ],
    }),
  ],
})
export class GraphQLModule {}
