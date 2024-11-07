import {
  ExecutionContext,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const contextType = context.getType<GqlContextType>();
    if (contextType === 'http') {
      super.getRequest(context);
    } else if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext();
      request.body = gqlContext.getArgs().loginInput;
      return request;
    } else {
      throw new NotImplementedException();
    }
  }
}
