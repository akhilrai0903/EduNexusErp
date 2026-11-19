import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Role } from './enums/role.enum';
import { User } from './entities/user.entity';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthResponseType } from './dto/user-response.dto';
import { GraphQLScalarType, Kind } from 'graphql';

// Custom scalar for Date
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponseType)
  async register(@Args('input') createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }

  @Mutation(() => AuthResponseType)
  async login(@Args('input') loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async logout(@Context() context: any): Promise<string> {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
    return 'Logged out successfully';
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthResponseType)
  async refreshToken(@Context() context: any): Promise<AuthResponse> {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      return this.authService.refreshToken(token);
    }
    throw new Error('No token provided');
  }

  @Mutation(() => String)
  async resetPassword(@Args('input') resetPasswordDto: ResetPasswordDto): Promise<string> {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.tenantId,
      resetPasswordDto.schoolId,
    );
    return 'Password reset instructions sent to your email';
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    await this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return 'Password changed successfully';
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return this.authService.getUserById(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => [User])
  async users(
    @CurrentUser() user: User,
    @Args('schoolId', { nullable: true }) schoolId?: string,
  ): Promise<User[]> {
    return this.authService.getUsersByTenant(user.tenantId, schoolId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => String)
  async updateUserStatus(
    @Args('userId') userId: string,
    @Args('isActive') isActive: boolean,
  ): Promise<string> {
    await this.authService.updateUserStatus(userId, isActive);
    return 'User status updated successfully';
  }

  @Query(() => DateScalar)
  dateScalar(): Date {
    return new Date();
  }
}
