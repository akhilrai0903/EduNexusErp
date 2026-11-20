import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSchoolDto extends PartialType(
  OmitType(CreateSchoolDto, ['tenantId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

