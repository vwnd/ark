import { ProjectEdge } from './project-edge.type';
import { ObjectType } from '@nestjs/graphql';
import { createConnectionType } from 'nestjs-graphql-connection';

@ObjectType()
export class ProjectConnection extends createConnectionType(ProjectEdge) {}
