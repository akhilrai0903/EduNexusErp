import { IsString, IsOptional, IsUUID, IsNumber, IsEnum, IsBoolean, IsDateString, IsObject } from 'class-validator';
import { FeeType } from '../enums/fee-type.enum';
import { PaymentFrequency } from '../enums/payment-frequency.enum';

export class CreateFeeComponentDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  feeStructureId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(FeeType)
  type: FeeType;

  @IsEnum(PaymentFrequency)
  @IsOptional()
  frequency?: PaymentFrequency;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean;

  @IsBoolean()
  @IsOptional()
  isRefundable?: boolean;

  @IsBoolean()
  @IsOptional()
  isWaivable?: boolean;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsDateString()
  @IsOptional()
  lateFeeStartDate?: Date;

  @IsNumber()
  @IsOptional()
  lateFeePercentage?: number;

  @IsObject()
  @IsOptional()
  conditions?: {
    minMarks?: number;
    attendancePercentage?: number;
    parentIncome?: number;
    scholarshipEligible?: boolean;
  };

  @IsNumber()
  @IsOptional()
  order?: number;
}

