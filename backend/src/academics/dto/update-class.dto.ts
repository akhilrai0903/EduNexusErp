import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClassDto extends PartialType(
  OmitType(CreateClassDto, ['tenantId', 'schoolId', 'academicYearId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

