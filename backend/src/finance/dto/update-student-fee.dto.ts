import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateStudentFeeDto } from './create-student-fee.dto';

export class UpdateStudentFeeDto extends PartialType(
  OmitType(CreateStudentFeeDto, ['tenantId', 'schoolId', 'studentId', 'feeStructureId'] as const)
) {}

