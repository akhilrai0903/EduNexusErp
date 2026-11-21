import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClassSectionDto } from './create-class-section.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClassSectionDto extends PartialType(
  OmitType(CreateClassSectionDto, ['tenantId', 'schoolId', 'classId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

