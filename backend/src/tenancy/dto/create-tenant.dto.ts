import { IsString, IsEmail, IsOptional, IsObject, IsBoolean, IsDateString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  subdomain: string;

  @IsString()
  domain: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsObject()
  @IsOptional()
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCss?: string;
  };

  @IsObject()
  @IsOptional()
  settings?: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
    language?: string;
    features?: string[];
  };

  @IsBoolean()
  @IsOptional()
  isTrialActive?: boolean;

  @IsDateString()
  @IsOptional()
  trialEndsAt?: Date;
}

