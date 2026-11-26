import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateFeeStructureDto } from './create-fee-structure.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFeeStructureDto extends PartialType(
  OmitType(CreateFeeStructureDto, ['tenantId', 'schoolId', 'academicYearId', 'classId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

