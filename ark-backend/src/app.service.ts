import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './database/drizzle/schema';

@Injectable()
export class AppService {
  constructor(
    @Inject('DATABASE')
    private readonly drizzle: PostgresJsDatabase<typeof schema>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async projects() {
    return this.drizzle.query.projects.findMany();
  }
}
