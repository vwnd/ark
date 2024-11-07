import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
