import { registerEnumType } from '@nestjs/graphql';

export enum ModelStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

registerEnumType(ModelStatus, {
  name: 'ModelStatus',
});
