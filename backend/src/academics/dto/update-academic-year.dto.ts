import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAcademicYearDto } from './create-academic-year.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAcademicYearDto extends PartialType(
  OmitType(CreateAcademicYearDto, ['tenantId', 'schoolId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

