import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(
    @Args('input') input: LoginInput,
    @Context('res') response: Response,
  ): Promise<LoginOutput> {
    return await this.authService.login(input, response);
  }
}
