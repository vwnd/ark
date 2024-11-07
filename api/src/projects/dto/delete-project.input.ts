import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteProjectInput {
  @Field()
  id: string;
}
