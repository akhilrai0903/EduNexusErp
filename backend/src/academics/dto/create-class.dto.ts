import { IsString, IsOptional, IsUUID, IsNumber, IsObject, IsBoolean } from 'class-validator';

export class CreateClassDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  academicYearId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  shortName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @IsNumber()
  @IsOptional()
  fees?: number;

  @IsObject()
  @IsOptional()
  gradeLevel?: {
    level: number;
    category: string;
  };

  @IsObject()
  @IsOptional()
  requirements?: {
    minimumAge?: number;
    prerequisites?: string[];
    documents?: string[];
  };

  @IsObject()
  @IsOptional()
  settings?: {
    attendanceRequired?: boolean;
    homeworkWeight?: number;
    examWeight?: number;
    projectWeight?: number;
  };
}

