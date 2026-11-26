import { IsString, IsOptional, IsUUID, IsObject, IsBoolean } from 'class-validator';

export class CreateFeeStructureDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  academicYearId: string;

  @IsUUID()
  classId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  settings?: {
    allowInstallments?: boolean;
    installmentCount?: number;
    lateFeePercentage?: number;
    gracePeriod?: number;
    refundPolicy?: string;
  };
}

