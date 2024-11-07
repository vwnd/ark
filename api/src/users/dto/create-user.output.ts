import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserOutput {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;
}
