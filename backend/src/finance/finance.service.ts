import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeeComponent } from './entities/fee-component.entity';
import { StudentFee } from './entities/student-fee.entity';
import { Payment } from './entities/payment.entity';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto';
import { CreateFeeComponentDto } from './dto/create-fee-component.dto';
import { UpdateFeeComponentDto } from './dto/update-fee-component.dto';
import { CreateStudentFeeDto } from './dto/create-student-fee.dto';
import { UpdateStudentFeeDto } from './dto/update-student-fee.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FeeStatus } from './enums/fee-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(FeeStructure)
    private feeStructureRepository: Repository<FeeStructure>,
    @InjectRepository(FeeComponent)
    private feeComponentRepository: Repository<FeeComponent>,
    @InjectRepository(StudentFee)
    private studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  // ===================== FEE STRUCTURE OPERATIONS =====================

  /**
   * Create a new fee structure
   */
  async createFeeStructure(createDto: CreateFeeStructureDto): Promise<FeeStructure> {
    // Set default settings if not provided
    if (!createDto.settings) {
      createDto.settings = {
        allowInstallments: true,
        installmentCount: 3,
        lateFeePercentage: 5,
        gracePeriod: 7,
        refundPolicy: 'No refund after 30 days',
      };
    }

    const feeStructure = this.feeStructureRepository.create(createDto);
    return await this.feeStructureRepository.save(feeStructure);
  }

  /**
   * Get all fee structures with optional filters
   */
  async findAllFeeStructures(filters?: {
    tenantId?: string;
    schoolId?: string;
    academicYearId?: string;
    classId?: string;
    isActive?: boolean;
  }): Promise<FeeStructure[]> {
    const where: FindOptionsWhere<FeeStructure> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters?.classId) where.classId = filters.classId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return await this.feeStructureRepository.find({
      where,
      relations: ['academicYear', 'class', 'components'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single fee structure by ID
   */
  async findOneFeeStructure(id: string): Promise<FeeStructure> {
    const feeStructure = await this.feeStructureRepository.findOne({
      where: { id },
      relations: ['academicYear', 'class', 'components'],
    });

    if (!feeStructure) {
      throw new NotFoundException(`Fee structure with ID ${id} not found`);
    }

    return feeStructure;
  }

  /**
   * Update fee structure details
   */
  async updateFeeStructure(id: string, updateDto: UpdateFeeStructureDto): Promise<FeeStructure> {
    const feeStructure = await this.findOneFeeStructure(id);
    Object.assign(feeStructure, updateDto);
    return await this.feeStructureRepository.save(feeStructure);
  }

  /**
   * Soft delete a fee structure
   */
  async removeFeeStructure(id: string): Promise<void> {
    const feeStructure = await this.findOneFeeStructure(id);
    await this.feeStructureRepository.softDelete(id);
  }

  /**
   * Get total fee amount for a fee structure
   */
  async getFeeStructureTotal(id: string): Promise<number> {
    const feeStructure = await this.findOneFeeStructure(id);
    const components = feeStructure.components || [];
    
    return components.reduce((total, component) => {
      const amount = Number(component.amount);
      const discount = Number(component.discountAmount) || 0;
      return total + (amount - discount);
    }, 0);
  }

  // ===================== FEE COMPONENT OPERATIONS =====================

  /**
   * Create a new fee component
   */
  async createFeeComponent(createDto: CreateFeeComponentDto): Promise<FeeComponent> {
    // Verify fee structure exists
    await this.findOneFeeStructure(createDto.feeStructureId);

    const feeComponent = this.feeComponentRepository.create(createDto);
    return await this.feeComponentRepository.save(feeComponent);
  }

  /**
   * Get all fee components with optional filters
   */
  async findAllFeeComponents(filters?: {
    tenantId?: string;
    schoolId?: string;
    feeStructureId?: string;
    type?: string;
    isMandatory?: boolean;
  }): Promise<FeeComponent[]> {
    const where: FindOptionsWhere<FeeComponent> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.feeStructureId) where.feeStructureId = filters.feeStructureId;
    if (filters?.type) where.type = filters.type as any;
    if (filters?.isMandatory !== undefined) where.isMandatory = filters.isMandatory;

    return await this.feeComponentRepository.find({
      where,
      relations: ['feeStructure'],
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get a single fee component by ID
   */
  async findOneFeeComponent(id: string): Promise<FeeComponent> {
    const feeComponent = await this.feeComponentRepository.findOne({
      where: { id },
      relations: ['feeStructure'],
    });

    if (!feeComponent) {
      throw new NotFoundException(`Fee component with ID ${id} not found`);
    }

    return feeComponent;
  }

  /**
   * Get components by fee structure
   */
  async findComponentsByFeeStructure(feeStructureId: string): Promise<FeeComponent[]> {
    return await this.feeComponentRepository.find({
      where: { feeStructureId },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Update fee component details
   */
  async updateFeeComponent(id: string, updateDto: UpdateFeeComponentDto): Promise<FeeComponent> {
    const feeComponent = await this.findOneFeeComponent(id);
    Object.assign(feeComponent, updateDto);
    return await this.feeComponentRepository.save(feeComponent);
  }

  /**
   * Soft delete a fee component
   */
  async removeFeeComponent(id: string): Promise<void> {
    const feeComponent = await this.findOneFeeComponent(id);
    await this.feeComponentRepository.softDelete(id);
  }

  // ===================== STUDENT FEE OPERATIONS =====================

  /**
   * Create a new student fee
   */
  async createStudentFee(createDto: CreateStudentFeeDto): Promise<StudentFee> {
    // Verify fee structure exists
    const feeStructure = await this.findOneFeeStructure(createDto.feeStructureId);

    // Check if student already has this fee structure assigned
    const existingFee = await this.studentFeeRepository.findOne({
      where: {
        studentId: createDto.studentId,
        feeStructureId: createDto.feeStructureId,
      },
    });

    if (existingFee) {
      throw new ConflictException('Student already has this fee structure assigned');
    }

    // Calculate pending amount
    const pendingAmount = createDto.totalAmount - (createDto.discountAmount || 0) - (createDto.waiverAmount || 0);

    // Create installment schedule if requested
    let installmentSchedule: any = undefined;
    if (createDto.allowInstallments && createDto.installmentCount && createDto.installmentCount > 1) {
      installmentSchedule = this.generateInstallmentSchedule(
        pendingAmount,
        createDto.installmentCount,
        new Date(createDto.dueDate)
      );
    }

    const studentFee = this.studentFeeRepository.create({
      ...createDto,
      pendingAmount: pendingAmount,
      paidAmount: 0,
      lateFeeAmount: 0,
      status: FeeStatus.PENDING,
      installmentSchedule: installmentSchedule,
    } as any);

    const savedStudentFee = await this.studentFeeRepository.save(studentFee);
    return Array.isArray(savedStudentFee) ? savedStudentFee[0] : savedStudentFee;
  }

  /**
   * Get all student fees with optional filters
   */
  async findAllStudentFees(filters?: {
    tenantId?: string;
    schoolId?: string;
    studentId?: string;
    feeStructureId?: string;
    status?: FeeStatus;
  }): Promise<StudentFee[]> {
    const where: FindOptionsWhere<StudentFee> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.studentId) where.studentId = filters.studentId;
    if (filters?.feeStructureId) where.feeStructureId = filters.feeStructureId;
    if (filters?.status) where.status = filters.status;

    return await this.studentFeeRepository.find({
      where,
      relations: ['student', 'feeStructure', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single student fee by ID
   */
  async findOneStudentFee(id: string): Promise<StudentFee> {
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id },
      relations: ['student', 'feeStructure', 'payments'],
    });

    if (!studentFee) {
      throw new NotFoundException(`Student fee with ID ${id} not found`);
    }

    return studentFee;
  }

  /**
   * Get student fees by student
   */
  async findStudentFeesByStudent(studentId: string): Promise<StudentFee[]> {
    return await this.studentFeeRepository.find({
      where: { studentId },
      relations: ['feeStructure', 'payments'],
      order: { dueDate: 'ASC' },
    });
  }

  /**
   * Update student fee details
   */
  async updateStudentFee(id: string, updateDto: UpdateStudentFeeDto): Promise<StudentFee> {
    const studentFee = await this.findOneStudentFee(id);
    Object.assign(studentFee, updateDto);

    // Recalculate pending amount if relevant fields changed
    if (updateDto.totalAmount || updateDto.discountAmount || updateDto.waiverAmount) {
      const totalAmount = updateDto.totalAmount || Number(studentFee.totalAmount);
      const paidAmount = Number(studentFee.paidAmount);
      const discountAmount = updateDto.discountAmount !== undefined ? updateDto.discountAmount : Number(studentFee.discountAmount);
      const waiverAmount = updateDto.waiverAmount !== undefined ? updateDto.waiverAmount : Number(studentFee.waiverAmount);
      
      studentFee.pendingAmount = totalAmount - paidAmount - discountAmount - waiverAmount;
    }

    return await this.studentFeeRepository.save(studentFee);
  }

  /**
   * Apply discount to student fee
   */
  async applyDiscount(id: string, discountAmount: number, reason: string, approvedBy: string): Promise<StudentFee> {
    const studentFee = await this.findOneStudentFee(id);

    studentFee.discountAmount = Number(studentFee.discountAmount) + discountAmount;
    studentFee.pendingAmount = Number(studentFee.pendingAmount) - discountAmount;

    // Add to concessions array
    if (!studentFee.concessions) {
      studentFee.concessions = [];
    }

    studentFee.concessions.push({
      type: 'discount',
      amount: discountAmount,
      reason,
      approvedBy,
      approvedAt: new Date(),
    });

    return await this.studentFeeRepository.save(studentFee);
  }

  /**
   * Apply waiver to student fee
   */
  async applyWaiver(id: string, waiverAmount: number, reason: string, approvedBy: string): Promise<StudentFee> {
    const studentFee = await this.findOneStudentFee(id);

    studentFee.waiverAmount = Number(studentFee.waiverAmount) + waiverAmount;
    studentFee.pendingAmount = Number(studentFee.pendingAmount) - waiverAmount;

    // Add to concessions array
    if (!studentFee.concessions) {
      studentFee.concessions = [];
    }

    studentFee.concessions.push({
      type: 'waiver',
      amount: waiverAmount,
      reason,
      approvedBy,
      approvedAt: new Date(),
    });

    // Update status if fully waived
    if (studentFee.pendingAmount <= 0) {
      studentFee.status = FeeStatus.WAIVED;
    }

    return await this.studentFeeRepository.save(studentFee);
  }

  /**
   * Mark fee as overdue
   */
  async markAsOverdue(id: string): Promise<StudentFee> {
    const studentFee = await this.findOneStudentFee(id);
    
    if (studentFee.status === FeeStatus.PENDING || studentFee.status === FeeStatus.PARTIAL) {
      studentFee.status = FeeStatus.OVERDUE;
      return await this.studentFeeRepository.save(studentFee);
    }

    return studentFee;
  }

  // ===================== PAYMENT OPERATIONS =====================

  /**
   * Create a new payment and update student fee
   */
  async createPayment(createDto: CreatePaymentDto): Promise<Payment> {
    // Verify student fee exists
    const studentFee = await this.findOneStudentFee(createDto.studentFeeId);

    // Validate payment amount
    if (createDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    if (createDto.amount > Number(studentFee.pendingAmount)) {
      throw new BadRequestException('Payment amount cannot exceed pending amount');
    }

    // Generate receipt number
    const receiptNumber = await this.generateReceiptNumber(createDto.tenantId);

    // Create payment
    const payment = this.paymentRepository.create({
      ...createDto,
      status: createDto.status || PaymentStatus.SUCCESSFUL,
      receiptNumber,
      processedAt: new Date(),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Update student fee
    if (payment.status === PaymentStatus.SUCCESSFUL) {
      await this.updateStudentFeeAfterPayment(createDto.studentFeeId, createDto.amount);
    }

    return savedPayment;
  }

  /**
   * Get all payments with optional filters
   */
  async findAllPayments(filters?: {
    tenantId?: string;
    schoolId?: string;
    studentId?: string;
    studentFeeId?: string;
    status?: PaymentStatus;
    method?: string;
  }): Promise<Payment[]> {
    const where: FindOptionsWhere<Payment> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.studentId) where.studentId = filters.studentId;
    if (filters?.studentFeeId) where.studentFeeId = filters.studentFeeId;
    if (filters?.status) where.status = filters.status;
    if (filters?.method) where.method = filters.method as any;

    return await this.paymentRepository.find({
      where,
      relations: ['student', 'studentFee'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single payment by ID
   */
  async findOnePayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['student', 'studentFee'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  /**
   * Get payments by student
   */
  async findPaymentsByStudent(studentId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { studentId },
      relations: ['studentFee'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get payments by student fee
   */
  async findPaymentsByStudentFee(studentFeeId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { studentFeeId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update payment details
   */
  async updatePayment(id: string, updateDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOnePayment(id);
    Object.assign(payment, updateDto);
    return await this.paymentRepository.save(payment);
  }

  /**
   * Process pending payment
   */
  async processPayment(id: string, successful: boolean, failureReason?: string): Promise<Payment> {
    const payment = await this.findOnePayment(id);

    if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.PROCESSING) {
      throw new BadRequestException('Can only process pending or processing payments');
    }

    if (successful) {
      payment.status = PaymentStatus.SUCCESSFUL;
      payment.processedAt = new Date();
      
      // Update student fee
      await this.updateStudentFeeAfterPayment(payment.studentFeeId, Number(payment.amount));
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failedAt = new Date();
      payment.failureReason = failureReason || 'Payment processing failed';
    }

    return await this.paymentRepository.save(payment);
  }

  /**
   * Refund a payment
   */
  async refundPayment(id: string, refundAmount: number, reason: string): Promise<Payment> {
    const payment = await this.findOnePayment(id);

    if (payment.status !== PaymentStatus.SUCCESSFUL) {
      throw new BadRequestException('Can only refund successful payments');
    }

    if (refundAmount > Number(payment.amount)) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Update payment status
    if (refundAmount === Number(payment.amount)) {
      payment.status = PaymentStatus.REFUNDED;
    } else {
      payment.status = PaymentStatus.PARTIALLY_REFUNDED;
    }

    // Update student fee
    const studentFee = await this.findOneStudentFee(payment.studentFeeId);
    studentFee.paidAmount = Number(studentFee.paidAmount) - refundAmount;
    studentFee.pendingAmount = Number(studentFee.pendingAmount) + refundAmount;

    // Update status based on amounts
    if (studentFee.paidAmount === 0) {
      studentFee.status = FeeStatus.PENDING;
    } else if (studentFee.pendingAmount > 0) {
      studentFee.status = FeeStatus.PARTIAL;
    }

    await this.studentFeeRepository.save(studentFee);

    return await this.paymentRepository.save(payment);
  }

  // ===================== HELPER METHODS =====================

  /**
   * Update student fee after successful payment
   */
  private async updateStudentFeeAfterPayment(studentFeeId: string, amount: number): Promise<void> {
    const studentFee = await this.findOneStudentFee(studentFeeId);

    studentFee.paidAmount = Number(studentFee.paidAmount) + amount;
    studentFee.pendingAmount = Number(studentFee.pendingAmount) - amount;
    studentFee.lastPaymentDate = new Date();

    // Update status based on amounts
    if (studentFee.pendingAmount <= 0) {
      studentFee.status = FeeStatus.PAID;
    } else if (studentFee.paidAmount > 0) {
      studentFee.status = FeeStatus.PARTIAL;
    }

    // Update installment schedule if applicable
    if (studentFee.installmentSchedule && studentFee.installmentSchedule.length > 0) {
      studentFee.paidInstallments = studentFee.paidInstallments + 1;
    }

    await this.studentFeeRepository.save(studentFee);
  }

  /**
   * Generate installment schedule
   */
  private generateInstallmentSchedule(
    totalAmount: number,
    installmentCount: number,
    firstDueDate: Date
  ): any[] {
    const installmentAmount = totalAmount / installmentCount;
    const schedule: any[] = [];

    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installmentNumber: i + 1,
        amount: installmentAmount,
        dueDate,
        paidAmount: 0,
        status: 'pending',
      } as any);
    }

    return schedule;
  }

  /**
   * Generate receipt number
   */
  private async generateReceiptNumber(tenantId: string): Promise<string> {
    const count = await this.paymentRepository.count({
      where: { tenantId },
    });

    const year = new Date().getFullYear();
    const paddedCount = String(count + 1).padStart(6, '0');
    
    return `RCP-${year}-${paddedCount}`;
  }

  /**
   * Get financial summary for a school
   */
  async getFinancialSummary(schoolId: string, academicYearId?: string): Promise<{
    totalCollected: number;
    totalPending: number;
    totalOverdue: number;
    totalWaivers: number;
    totalDiscounts: number;
  }> {
    const where: FindOptionsWhere<StudentFee> = { schoolId };
    if (academicYearId) {
      // Note: This would need a relation through feeStructure
      // For now, we'll get all fees for the school
    }

    const studentFees = await this.studentFeeRepository.find({ where });

    const summary = {
      totalCollected: 0,
      totalPending: 0,
      totalOverdue: 0,
      totalWaivers: 0,
      totalDiscounts: 0,
    };

    for (const fee of studentFees) {
      summary.totalCollected += Number(fee.paidAmount);
      summary.totalPending += Number(fee.pendingAmount);
      summary.totalWaivers += Number(fee.waiverAmount);
      summary.totalDiscounts += Number(fee.discountAmount);

      if (fee.status === FeeStatus.OVERDUE) {
        summary.totalOverdue += Number(fee.pendingAmount);
      }
    }

    return summary;
  }
}
