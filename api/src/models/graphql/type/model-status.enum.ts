import { registerEnumType } from '@nestjs/graphql';

export enum ModelStatus {
  CREATED = 'CREATED',
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

registerEnumType(ModelStatus, {
  name: 'ModelStatus',
});
