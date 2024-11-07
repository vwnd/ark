import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { ProjectsService } from '@/projects/projects.service';
import { CreateUserOutput } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';

describe('ProjectsResolver', () => {
  let app: INestApplication;
  let projectsService: ProjectsService;

  let usersService: UsersService;
  let testUser: CreateUserOutput;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    projectsService = moduleFixture.get<ProjectsService>(ProjectsService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    testUser = await usersService.create({
      email: 'test@email.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    });

    await app.init();
  });

  afterAll(async () => {
    await usersService.delete(testUser.id);
    await app.close();
  });

  it.only('creates a project', () => {
    const query = `#graphql
      mutation {
        createProject(input: {
          name: "Test Project"
        }) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
      })
      .expect(200)
      .expect(async (response) => {
        if (response.body.errors)
          console.error(JSON.stringify(response.body.errors));
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.createProject).toBeDefined();

        const createdId = response.body.data.createProject.id;
        const project = await projectsService.findById(createdId);
        expect(project.id).toBe(createdId);
      });
  });

  it('queries a project', async () => {
    const testProject = await projectsService.create(
      {
        name: 'Test Project',
      },
      testUser,
    );

    const query = `#graphql
      query($projectId: String!) {
        project(id: $projectId) {
          id
          name
          createdAt
          updatedAt
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: {
          projectId: testProject.id,
        },
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.project).toBeDefined();
      });
  });

  it('deletes a project', async () => {
    const testProject = await projectsService.create(
      {
        name: 'Test Project',
      },
      testUser,
    );

    const query = `#graphql
      mutation {
        deleteProject(input: {
          id: "${testProject.id}"
        })
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: {
          projectId: testProject.id,
        },
      })
      .expect(200)
      .expect(async (response) => {
        console.log(response.body);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.deleteProject).toBe(true);
      });
  });
});
