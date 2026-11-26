import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateFeeComponentDto } from './create-fee-component.dto';

export class UpdateFeeComponentDto extends PartialType(
  OmitType(CreateFeeComponentDto, ['tenantId', 'schoolId', 'feeStructureId'] as const)
) {}

