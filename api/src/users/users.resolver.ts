import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { RequestUser } from '@/auth/dto/user.type';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { CreateUserOutput } from './dto/create-user.output';
import { UserInfo } from './dto/user-info.type';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => UserInfo)
  @UseGuards(JwtAuthGuard)
  async userInfo(@CurrentUser() user: RequestUser) {
    return this.usersService.getUserById(user.id);
  }

  @Mutation(() => User)
  async removeUser(@Args('id') id: string) {
    return this.usersService.delete(id);
  }
}
