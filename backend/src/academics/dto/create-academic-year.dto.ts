import { IsString, IsDateString, IsOptional, IsBoolean, IsArray, IsObject, IsUUID, IsNumber } from 'class-validator';

export class CreateAcademicYearDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsString()
  name: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsArray()
  @IsOptional()
  terms?: {
    name: string;
    startDate: Date;
    endDate: Date;
    weightage: number;
  }[];

  @IsArray()
  @IsOptional()
  holidays?: {
    name: string;
    date: Date;
    type: string;
  }[];

  @IsObject()
  @IsOptional()
  settings?: {
    gradingSystem?: string;
    attendanceThreshold?: number;
    maxAbsenceDays?: number;
    workingDays?: number;
  };
}

