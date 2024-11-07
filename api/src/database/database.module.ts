import { Module } from '@nestjs/common';

import { DrizzleGraphQLPaginationService } from './drizzle-graphql-pagination.service';
import { DrizzleDatabaseModule } from './drizzle/drizzle-database.module';

export { DATABASE_KEY } from './drizzle/drizzle-database.module';

@Module({
  imports: [DrizzleDatabaseModule],
  providers: [DrizzleGraphQLPaginationService],
  exports: [DrizzleDatabaseModule, DrizzleGraphQLPaginationService],
})
export class DatabaseModule {}
