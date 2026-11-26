import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto';
import { CreateFeeComponentDto } from './dto/create-fee-component.dto';
import { UpdateFeeComponentDto } from './dto/update-fee-component.dto';
import { CreateStudentFeeDto } from './dto/create-student-fee.dto';
import { UpdateStudentFeeDto } from './dto/update-student-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FeeStatus } from './enums/fee-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ===================== FEE STRUCTURE ENDPOINTS =====================

  @Post('fee-structures')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  @HttpCode(HttpStatus.CREATED)
  async createFeeStructure(@Body() createDto: CreateFeeStructureDto) {
    return await this.financeService.createFeeStructure(createDto);
  }

  @Get('fee-structures')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER)
  async findAllFeeStructures(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('academicYearId') academicYearId?: string,
    @Query('classId') classId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (academicYearId) filters.academicYearId = academicYearId;
    if (classId) filters.classId = classId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return await this.financeService.findAllFeeStructures(filters);
  }

  @Get('fee-structures/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER, Role.PARENT)
  async findOneFeeStructure(@Param('id') id: string) {
    return await this.financeService.findOneFeeStructure(id);
  }

  @Patch('fee-structures/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async updateFeeStructure(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeeStructureDto,
  ) {
    return await this.financeService.updateFeeStructure(id, updateDto);
  }

  @Delete('fee-structures/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFeeStructure(@Param('id') id: string) {
    return await this.financeService.removeFeeStructure(id);
  }

  @Get('fee-structures/:id/total')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async getFeeStructureTotal(@Param('id') id: string) {
    const total = await this.financeService.getFeeStructureTotal(id);
    return { total };
  }

  // ===================== FEE COMPONENT ENDPOINTS =====================

  @Post('fee-components')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  @HttpCode(HttpStatus.CREATED)
  async createFeeComponent(@Body() createDto: CreateFeeComponentDto) {
    return await this.financeService.createFeeComponent(createDto);
  }

  @Get('fee-components')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER)
  async findAllFeeComponents(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('feeStructureId') feeStructureId?: string,
    @Query('type') type?: string,
    @Query('isMandatory') isMandatory?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (feeStructureId) filters.feeStructureId = feeStructureId;
    if (type) filters.type = type;
    if (isMandatory !== undefined) filters.isMandatory = isMandatory === 'true';

    return await this.financeService.findAllFeeComponents(filters);
  }

  @Get('fee-components/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER)
  async findOneFeeComponent(@Param('id') id: string) {
    return await this.financeService.findOneFeeComponent(id);
  }

  @Get('fee-structures/:feeStructureId/components')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER, Role.PARENT)
  async findComponentsByFeeStructure(@Param('feeStructureId') feeStructureId: string) {
    return await this.financeService.findComponentsByFeeStructure(feeStructureId);
  }

  @Patch('fee-components/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async updateFeeComponent(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeeComponentDto,
  ) {
    return await this.financeService.updateFeeComponent(id, updateDto);
  }

  @Delete('fee-components/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFeeComponent(@Param('id') id: string) {
    return await this.financeService.removeFeeComponent(id);
  }

  // ===================== STUDENT FEE ENDPOINTS =====================

  @Post('student-fees')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  @HttpCode(HttpStatus.CREATED)
  async createStudentFee(@Body() createDto: CreateStudentFeeDto) {
    return await this.financeService.createStudentFee(createDto);
  }

  @Get('student-fees')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER)
  async findAllStudentFees(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('studentId') studentId?: string,
    @Query('feeStructureId') feeStructureId?: string,
    @Query('status') status?: FeeStatus,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (studentId) filters.studentId = studentId;
    if (feeStructureId) filters.feeStructureId = feeStructureId;
    if (status) filters.status = status;

    return await this.financeService.findAllStudentFees(filters);
  }

  @Get('student-fees/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER, Role.PARENT, Role.STUDENT)
  async findOneStudentFee(@Param('id') id: string) {
    return await this.financeService.findOneStudentFee(id);
  }

  @Get('students/:studentId/fees')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER, Role.PARENT, Role.STUDENT)
  async findStudentFeesByStudent(@Param('studentId') studentId: string) {
    return await this.financeService.findStudentFeesByStudent(studentId);
  }

  @Patch('student-fees/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async updateStudentFee(
    @Param('id') id: string,
    @Body() updateDto: UpdateStudentFeeDto,
  ) {
    return await this.financeService.updateStudentFee(id, updateDto);
  }

  @Post('student-fees/:id/discount')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async applyDiscount(
    @Param('id') id: string,
    @Body() body: { discountAmount: number; reason: string; approvedBy: string },
  ) {
    return await this.financeService.applyDiscount(id, body.discountAmount, body.reason, body.approvedBy);
  }

  @Post('student-fees/:id/waiver')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async applyWaiver(
    @Param('id') id: string,
    @Body() body: { waiverAmount: number; reason: string; approvedBy: string },
  ) {
    return await this.financeService.applyWaiver(id, body.waiverAmount, body.reason, body.approvedBy);
  }

  @Post('student-fees/:id/mark-overdue')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT)
  async markAsOverdue(@Param('id') id: string) {
    return await this.financeService.markAsOverdue(id);
  }

  // ===================== PAYMENT ENDPOINTS =====================

  @Post('payments')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.PARENT, Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() createDto: CreatePaymentDto) {
    return await this.financeService.createPayment(createDto);
  }

  @Get('payments')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.TEACHER)
  async findAllPayments(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('studentId') studentId?: string,
    @Query('studentFeeId') studentFeeId?: string,
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (studentId) filters.studentId = studentId;
    if (studentFeeId) filters.studentFeeId = studentFeeId;
    if (status) filters.status = status;
    if (method) filters.method = method;

    return await this.financeService.findAllPayments(filters);
  }

  @Get('payments/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.PARENT, Role.STUDENT)
  async findOnePayment(@Param('id') id: string) {
    return await this.financeService.findOnePayment(id);
  }

  @Get('students/:studentId/payments')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.PARENT, Role.STUDENT)
  async findPaymentsByStudent(@Param('studentId') studentId: string) {
    return await this.financeService.findPaymentsByStudent(studentId);
  }

  @Get('student-fees/:studentFeeId/payments')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT, Role.PARENT, Role.STUDENT)
  async findPaymentsByStudentFee(@Param('studentFeeId') studentFeeId: string) {
    return await this.financeService.findPaymentsByStudentFee(studentFeeId);
  }

  @Patch('payments/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT)
  async updatePayment(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentDto,
  ) {
    return await this.financeService.updatePayment(id, updateDto);
  }

  @Post('payments/:id/process')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT)
  async processPayment(
    @Param('id') id: string,
    @Body() body: { successful: boolean; failureReason?: string },
  ) {
    return await this.financeService.processPayment(id, body.successful, body.failureReason);
  }

  @Post('payments/:id/refund')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async refundPayment(
    @Param('id') id: string,
    @Body() body: { refundAmount: number; reason: string },
  ) {
    return await this.financeService.refundPayment(id, body.refundAmount, body.reason);
  }

  // ===================== REPORTS & ANALYTICS =====================

  @Get('schools/:schoolId/financial-summary')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.ACCOUNTANT)
  async getFinancialSummary(
    @Param('schoolId') schoolId: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return await this.financeService.getFinancialSummary(schoolId, academicYearId);
  }
}
