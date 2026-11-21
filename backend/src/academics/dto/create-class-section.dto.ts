import { IsString, IsOptional, IsUUID, IsNumber, IsObject } from 'class-validator';

export class CreateClassSectionDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  classId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  shortName?: string;

  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @IsObject()
  @IsOptional()
  settings?: {
    roomNumber?: string;
    capacity?: number;
    equipment?: string[];
  };
}

