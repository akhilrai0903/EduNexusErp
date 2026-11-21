import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubjectDto extends PartialType(
  OmitType(CreateSubjectDto, ['tenantId', 'schoolId', 'classId'] as const)
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

