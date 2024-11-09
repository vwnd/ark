import { registerEnumType } from '@nestjs/graphql';

export enum ModelType {
  REVIT = 'REVIT',
  RHINO = 'RHINO',
}

registerEnumType(ModelType, {
  name: 'ModelType',
});
