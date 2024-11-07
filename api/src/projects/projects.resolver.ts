import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectInput } from './dto/create-project.input';
import { CreateProjectOutput } from './dto/create-project.output';
import { Project } from './dto/project.type';
import { ProjectsService } from './projects.service';
import { DeleteProjectInput } from './dto/delete-project.input';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { RequestUser } from '@/auth/dto/user.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

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
}
