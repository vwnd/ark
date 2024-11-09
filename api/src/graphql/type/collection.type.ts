import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface Collection<T> {
  cursor: string | null;
  items: T[];
}

export function CollectionType<T>(classRef: Type<T>): Type<Collection<T>> {
  @ObjectType({ isAbstract: true })
  abstract class CollectionType implements Collection<T> {
    @Field(() => String, { nullable: true })
    cursor: string;

    @Field(() => [classRef])
    items: T[];
  }
  return CollectionType as Type<Collection<T>>;
}
