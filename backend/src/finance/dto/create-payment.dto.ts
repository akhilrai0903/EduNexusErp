import { IsUUID, IsNumber, IsEnum, IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class CreatePaymentDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  schoolId: string;

  @IsUUID()
  studentFeeId: string;

  @IsUUID()
  studentId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsObject()
  @IsOptional()
  gatewayDetails?: {
    gateway: string;
    gatewayTransactionId?: string;
    gatewayResponse?: any;
    processingFee?: number;
  };

  @IsArray()
  @IsOptional()
  paymentBreakdown?: {
    componentId: string;
    componentName: string;
    amount: number;
  }[];

  @IsUUID()
  @IsOptional()
  processedBy?: string;
}

