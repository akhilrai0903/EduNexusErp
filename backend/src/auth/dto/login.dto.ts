import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;
}
