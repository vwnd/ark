import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field()
  token: string;

  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;
}
