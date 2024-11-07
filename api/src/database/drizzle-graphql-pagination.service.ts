import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AnyPgColumn, AnyPgTable } from 'drizzle-orm/pg-core';
import { Connection, Edge } from 'graphql-relay';
import generateCursor, { Cursor } from 'drizzle-cursor';
import { and, SelectedFields, SQL } from 'drizzle-orm';
import { DATABASE_KEY } from './drizzle/drizzle-database.module';
import { ConnectionArgs } from 'nestjs-graphql-connection';

enum PaginationDirection {
  FORWARD,
  BACKWARD,
}

@Injectable()
export class DrizzleGraphQLPaginationService<
  SchemaType extends Record<string, unknown>,
> {
  constructor(
    @Inject(DATABASE_KEY)
    private readonly db: PostgresJsDatabase<SchemaType>,
  ) {}

  async getConnection<NodeType, TableType extends AnyPgTable>(
    pagination: ConnectionArgs,
    cursors: { primary: Cursor; others: Cursor[] | undefined },
    table: TableType,
    mapToNode: (d: TableType['$inferSelect']) => NodeType,
    columns?: SelectedFields<AnyPgColumn, TableType>,
    filters?: SQL<unknown> | undefined,
  ): Promise<Connection<NodeType>> {
    this.validatePaginationArgs(pagination);

    const pageSize = pagination.first || pagination.last || 20;

    const direction = pagination.last
      ? PaginationDirection.BACKWARD
      : PaginationDirection.FORWARD;

    const cursor = this.getOrientedCursor(direction, cursors);

    const cursorWhere = pagination.after
      ? cursor.where(cursor.parse(pagination.after))
      : pagination.before
        ? cursor.where(cursor.parse(pagination.before))
        : cursor.where();

    const whereClause =
      filters !== undefined ? and(filters, cursorWhere) : cursorWhere;

    const queryWithAppliedSelectedFields = columns
      ? this.db.select(columns)
      : this.db.select();

    const query = queryWithAppliedSelectedFields
      .from(table)
      .orderBy(...cursor.orderBy)
      .where(whereClause)
      .limit(pageSize);

    const data = await query;

    if (direction === PaginationDirection.BACKWARD) data.reverse();

    const edges: Edge<NodeType>[] = data.map((d) => {
      const serializedCursor = cursor.serialize(d);

      if (!serializedCursor) throw new Error('Failed to serialize cursor');

      return {
        cursor: serializedCursor,
        node: mapToNode(d),
      };
    });

    const firstDataItem = data.at(0);
    const lastDataItem = data.at(-1);

    const startCursor = data.length > 0 ? cursor.serialize(firstDataItem) : '';
    const endCursor = data.length > 0 ? cursor.serialize(lastDataItem) : '';

    let hasNextPage = false;
    let hasPreviousPage = false;

    const forwardCursor = this.getOrientedCursor(
      PaginationDirection.FORWARD,
      cursors,
    );
    const backwardCursor = this.getOrientedCursor(
      PaginationDirection.BACKWARD,
      cursors,
    );

    /**
     * Define when there is a next page/previous page
     */
    const firstConnectionItem = (
      await this.db
        .select()
        .from(table)
        .orderBy(...forwardCursor.orderBy)
        .where(filters)
        .limit(1)
    )[0];

    const lastConnectionItem = (
      await this.db
        .select()
        .from(table)
        .orderBy(...backwardCursor.orderBy)
        .where(filters)
        .limit(1)
    )[0];

    if (lastDataItem) {
      if (lastDataItem.id == lastConnectionItem.id) {
        hasNextPage = false;
      } else {
        hasNextPage = true;
      }
    }

    if (firstDataItem) {
      if (firstDataItem.id == firstConnectionItem.id) {
        hasPreviousPage = false;
      } else {
        hasPreviousPage = true;
      }
    }

    const connection: Connection<NodeType> = {
      edges,
      pageInfo: {
        endCursor,
        hasNextPage,
        hasPreviousPage,
        startCursor,
      },
    };

    return connection;
  }

  private validatePaginationArgs(pagination: ConnectionArgs) {
    if (pagination.first && pagination.last)
      throw new ForbiddenException(
        'Pagination arguments first and last cannot be used at the same time.',
      );

    if (pagination.first && pagination.first > 100)
      throw new ForbiddenException('Cannot query more than 100 items.');

    if (pagination.last && pagination.last > 100)
      throw new ForbiddenException('Cannot query more than 100 items.');
  }

  private getOrientedCursor(
    direction: PaginationDirection,
    cursor: {
      primary: Cursor;
      others: Cursor[] | undefined;
    },
  ) {
    const flipOrder = (order: 'ASC' | 'DESC' | undefined) => {
      return order === 'ASC' ? 'DESC' : 'ASC';
    };

    const { primary, others = [] } = cursor;

    const orientedSecondaryCursors =
      others.length > 0
        ? others.map((cursor) => ({
            ...cursor,
            order:
              direction === PaginationDirection.FORWARD
                ? cursor.order
                : flipOrder(cursor.order),
          }))
        : undefined;

    const primaryCursor = {
      ...primary,
      order:
        direction === PaginationDirection.FORWARD
          ? primary.order
          : flipOrder(primary.order),
    };

    return generateCursor({
      primaryCursor: primaryCursor,
      cursors: orientedSecondaryCursors,
    });
  }
}
