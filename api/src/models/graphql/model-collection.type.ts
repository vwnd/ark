import { CollectionType } from '@/graphql/type/collection.type';
import { ObjectType } from '@nestjs/graphql';
import { Model } from './type/model.type';

@ObjectType()
export class ModelCollection extends CollectionType(Model) {}
