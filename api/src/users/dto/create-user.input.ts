import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  password: string;
}
