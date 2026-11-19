import { IsString, MinLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
