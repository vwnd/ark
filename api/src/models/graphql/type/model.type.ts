import { Field, ObjectType } from '@nestjs/graphql';
import { ModelStatus } from './model-status.enum';

@ObjectType()
export class Model {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => ModelStatus)
  status: ModelStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
