import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateProjectOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  createdBy: string;
}
