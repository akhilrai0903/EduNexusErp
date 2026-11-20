import { IsString, IsEmail, IsOptional, IsObject, IsDateString, IsUUID } from 'class-validator';

export class CreateSchoolDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  shortName?: string;

  @IsString()
  @IsOptional()
  motto?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  principalName?: string;

  @IsEmail()
  @IsOptional()
  principalEmail?: string;

  @IsString()
  @IsOptional()
  principalPhone?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsDateString()
  @IsOptional()
  establishedDate?: Date;

  @IsObject()
  @IsOptional()
  academicSettings?: {
    gradingSystem?: string;
    attendanceThreshold?: number;
    maxAbsenceDays?: number;
    examWeightage?: Record<string, number>;
  };

  @IsObject()
  @IsOptional()
  feeSettings?: {
    currency?: string;
    lateFeePercentage?: number;
    gracePeriod?: number;
    installmentCount?: number;
  };
}

