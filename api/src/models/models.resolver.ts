import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { RequestUser } from '@/auth/dto/user.type';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateModelInput } from './dto/create-model.input';
import { CreateModelOutput } from './dto/create-model.output';
import { ModelsService } from './services/models.service';

@Resolver()
export class ModelsResolver {
  constructor(private readonly modelsService: ModelsService) {}

  @Mutation(() => CreateModelOutput)
  @UseGuards(JwtAuthGuard)
  async createModel(
    @Args('input') input: CreateModelInput,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateModelOutput> {
    return this.modelsService.createModel(input, user.id);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getModelUploadURL(
    @Args('modelId') modelId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<string> {
    return this.modelsService.getModelUploadURL(modelId, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async publishModel(
    @Args('modelId') modelId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<boolean> {
    return this.modelsService.publishModel(modelId, user.id);
  }
}
