import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { CreateProjectOutput } from './dto/create-project.output';
import { Project } from './dto/project.type';
import { projects } from './projects.schema';
import * as projectsSchema from './projects.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, desc, eq } from 'drizzle-orm';
import { Connection } from 'graphql-relay';
import { DrizzleGraphQLPaginationService } from '@/database/drizzle-graphql-pagination.service';
import { Cursor } from 'drizzle-cursor';
import { DATABASE_KEY } from '@/database/database.module';
import { ProjectConnectionArgs } from './dto/project-connection.args';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_KEY)
    private readonly db: PostgresJsDatabase<typeof projectsSchema>,

    private readonly paginationService: DrizzleGraphQLPaginationService<
      typeof projectsSchema
    >,
  ) {}

  async create(
    input: CreateProjectInput,
    user: { id: string },
  ): Promise<CreateProjectOutput> {
    try {
      const result = (
        await this.db
          .insert(projects)
          .values({ name: input.name, createdBy: user.id })
          .returning({
            id: projects.id,
            name: projects.name,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            createdBy: projects.createdBy,
          })
      )[0];

      return { ...result };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create project.');
    }
  }

  async findById(id: string, userId: string): Promise<Project> {
    const result = await this.db.query.projects.findFirst({
      where: (projects, { eq, and }) =>
        and(eq(projects.id, id), eq(projects.createdBy, userId)),
    });

    if (!result) {
      throw new NotFoundException('Failed to find project.');
    }

    return { ...result };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const result = await this.db
        .delete(projects)
        .where(and(eq(projects.id, id), eq(projects.createdBy, userId)))
        .returning({
          id: projects.id,
        });

      if (result.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete project.');
    }
  }
  async getRecentProjects(userId: string): Promise<Project[]> {
    const result = await this.db
      .select()
      .from(projects)
      .where(({ createdBy }) => eq(createdBy, userId))
      .orderBy(desc(projects.updatedAt))
      .limit(20);

    const output: Project[] = result.map((data) => ({
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return output;
  }

  async getConnection(
    args: ProjectConnectionArgs,
  ): Promise<Connection<Project>> {
    const primaryCursor: Cursor = {
      key: 'id',
      schema: projects.id,
      order: 'ASC',
    };

    const cursorData = { primary: primaryCursor, others: [] };
    type SelectProjects = typeof projects.$inferSelect;

    const mapToNodeFn = (data: SelectProjects): Project => ({
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });

    return this.paginationService.getConnection<Project, typeof projects>(
      args,
      cursorData,
      projects,
      mapToNodeFn,
      {
        id: projects.id,
        name: projects.name,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      },
      undefined,
    );
  }
}
