import { IsEnum, IsUUID, IsDateString, IsNumber, IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  tenantId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsDateString()
  @IsOptional()
  trialEndsAt?: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsNumber()
  @IsOptional()
  studentLimit?: number;

  @IsNumber()
  @IsOptional()
  staffLimit?: number;

  @IsNumber()
  @IsOptional()
  storageLimit?: number;

  @IsObject()
  @IsOptional()
  billingInfo?: {
    billingCycle?: string;
    autoRenew?: boolean;
    paymentGateway?: string;
  };
}

