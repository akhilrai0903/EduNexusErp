import { IsUUID, IsNumber, IsDateString, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { FeeStatus } from '../enums/fee-status.enum';

export class CreateStudentFeeDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  studentId: string;

  @IsUUID()
  feeStructureId: string;

  @IsEnum(FeeStatus)
  @IsOptional()
  status?: FeeStatus;

  @IsNumber()
  totalAmount: number;

  @IsDateString()
  dueDate: Date;

  @IsBoolean()
  @IsOptional()
  allowInstallments?: boolean;

  @IsNumber()
  @IsOptional()
  installmentCount?: number;

  @IsArray()
  @IsOptional()
  feeBreakdown?: {
    componentId: string;
    componentName: string;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: Date;
  }[];

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  waiverAmount?: number;
}

