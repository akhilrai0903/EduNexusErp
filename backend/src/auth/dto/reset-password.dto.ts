import { IsEmail, IsUUID } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;
}
