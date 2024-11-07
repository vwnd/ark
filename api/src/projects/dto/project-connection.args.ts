import { ArgsType } from '@nestjs/graphql';
import { ConnectionArgs } from 'nestjs-graphql-connection';

@ArgsType()
export class ProjectConnectionArgs extends ConnectionArgs {}
