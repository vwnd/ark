import { Project } from './project.type';
import { ObjectType } from '@nestjs/graphql';
import { createEdgeType } from 'nestjs-graphql-connection';

@ObjectType()
export class ProjectEdge extends createEdgeType(Project) {}
