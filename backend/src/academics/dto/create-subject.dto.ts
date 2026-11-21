import { IsString, IsOptional, IsUUID, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator';
import { SubjectType } from '../enums/subject-type.enum';
import { SubjectCategory } from '../enums/subject-category.enum';

export class CreateSubjectDto {
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

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SubjectType)
  @IsOptional()
  type?: SubjectType;

  @IsEnum(SubjectCategory)
  @IsOptional()
  category?: SubjectCategory;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsNumber()
  @IsOptional()
  maxMarks?: number;

  @IsNumber()
  @IsOptional()
  passMarks?: number;

  @IsArray()
  @IsOptional()
  gradingScale?: {
    grade: string;
    minMarks: number;
    maxMarks: number;
    points: number;
  }[];

  @IsObject()
  @IsOptional()
  assessmentWeights?: {
    homework?: number;
    quiz?: number;
    midterm?: number;
    final?: number;
    project?: number;
    attendance?: number;
  };

  @IsObject()
  @IsOptional()
  syllabus?: {
    topics: string[];
    objectives: string[];
    resources: string[];
  };
}

