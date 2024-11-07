import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
} from '@apollo/server';
import { Logger } from '@nestjs/common';

export class GraphQLLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger('GraphQL');

  contextCreationDidFail({ error }: { error: Error }): Promise<void> {
    this.logger.error('Context creation failed', error.stack);
    return Promise.resolve();
  }

  startupDidFail({ error }: { error: Error }): Promise<void> {
    this.logger.error('Startup failed', error.stack);
    return Promise.resolve();
  }

  unexpectedErrorProcessingRequest({
    error,
  }: {
    requestContext: GraphQLRequestContext<BaseContext>;
    error: Error;
  }): Promise<void> {
    this.logger.error('Unexpected error processing request', error.stack);
    return Promise.resolve();
  }

  invalidRequestWasReceived({ error }: { error: Error }): Promise<void> {
    this.logger.error('Invalid request was received', error.stack);
    return Promise.resolve();
  }
}
