import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { RequestUser } from '@/auth/dto/user.type';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ModelsService } from '@/models/core/models.service';
import { ModelCollection } from '@/models/graphql/model-collection.type';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateProjectInput } from './dto/create-project.input';
import { CreateProjectOutput } from './dto/create-project.output';
import { DeleteProjectInput } from './dto/delete-project.input';
import { Project } from './dto/project.type';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly modelsService: ModelsService,
  ) {}

  @Query(() => Project)
  @UseGuards(JwtAuthGuard)
  async project(
    @Args('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<Project> {
    return this.projectsService.findById(id, user.id);
  }

  @Query(() => [Project])
  @UseGuards(JwtAuthGuard)
  async recentProjects(@CurrentUser() user: RequestUser): Promise<Project[]> {
    return this.projectsService.getRecentProjects(user.id);
  }

  @Mutation(() => CreateProjectOutput)
  @UseGuards(JwtAuthGuard)
  async createProject(
    @Args('input') input: CreateProjectInput,
    @CurrentUser() user: RequestUser,
  ): Promise<CreateProjectOutput> {
    return this.projectsService.create(input, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteProject(
    @Args('input') input: DeleteProjectInput,
    @CurrentUser() user: RequestUser,
  ): Promise<boolean> {
    return this.projectsService.delete(input.id, user.id);
  }

  @ResolveField(() => ModelCollection)
  @UseGuards(JwtAuthGuard)
  async models(@Parent() project: Project): Promise<ModelCollection> {
    return this.modelsService.getProjectModels(project.id);
  }
}
