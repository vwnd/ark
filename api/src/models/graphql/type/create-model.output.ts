import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateModelOutput {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  projectId: string;
  @Field()
  createdBy: string;
}
