import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  profile?: any;
}

@ObjectType()
export class AuthResponseType {
  @Field(() => UserResponse)
  user: UserResponse;

  @Field()
  accessToken: string;

  @Field()
  expiresIn: string;
}
