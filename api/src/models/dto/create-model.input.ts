import { Field, InputType } from '@nestjs/graphql';
import { ModelType } from '../enum/model-type.enum';

@InputType()
export class CreateModelInput {
  @Field()
  name: string;

  @Field()
  projectId: string;

  @Field(() => ModelType)
  modelType: ModelType;
}
