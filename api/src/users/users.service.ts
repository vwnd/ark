import { DATABASE_KEY } from '@/database/database.module';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { hash } from 'bcryptjs';

import { eq } from 'drizzle-orm';
import { CreateUserInput } from './dto/create-user.input';
import { CreateUserOutput } from './dto/create-user.output';
import * as usersSchema from './schema/users.schema';
const users = usersSchema.users;

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_KEY)
    private readonly db: PostgresJsDatabase<typeof usersSchema>,
  ) {}

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    const { email, name, password } = input;

    const existingUser = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    try {
      const result = (
        await this.db
          .insert(users)
          .values({
            email: email,
            name: name,
            password: await hash(password, 10),
          })
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
          })
      )[0];

      return result;
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async getUserById(id: string) {
    const user = (
      await this.db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          deletedAt: users.deletedAt,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
    )[0];

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = (
      await this.db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          deletedAt: users.deletedAt,
          password: users.password,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
    )[0];

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  delete(id: string) {
    return `This action removes a #${id} user`;
  }
}
