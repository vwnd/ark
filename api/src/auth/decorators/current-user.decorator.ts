import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestUser } from '../dto/user.type';

const getCurrentUserByContext = (context: ExecutionContext): RequestUser => {
  const gqlContext = GqlExecutionContext.create(context);
  const requestContext = gqlContext.getContext();
  const currentUser = requestContext.req.user;
  return currentUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
