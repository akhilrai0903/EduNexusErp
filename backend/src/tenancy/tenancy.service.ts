import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { School } from './entities/school.entity';
import { Subscription } from './entities/subscription.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from './enums/subscription-status.enum';
import { SubscriptionPlan } from './enums/subscription-plan.enum';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  // ===================== TENANT OPERATIONS =====================

  /**
   * Create a new tenant with optional trial period
   */
  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if subdomain already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain },
    });

    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    // Check if domain already exists
    const existingDomain = await this.tenantRepository.findOne({
      where: { domain: createTenantDto.domain },
    });

    if (existingDomain) {
      throw new ConflictException('Domain already exists');
    }

    // Set default trial period if trial is active
    if (createTenantDto.isTrialActive && !createTenantDto.trialEndsAt) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial
      createTenantDto.trialEndsAt = trialEndDate;
    }

    // Set default settings if not provided
    if (!createTenantDto.settings) {
      createTenantDto.settings = {
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        currency: 'USD',
        language: 'en',
        features: [],
      };
    }

    const tenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  /**
   * Get all tenants with optional filters
   */
  async findAllTenants(filters?: {
    isActive?: boolean;
    isTrialActive?: boolean;
    search?: string;
  }): Promise<Tenant[]> {
    const where: FindOptionsWhere<Tenant> = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isTrialActive !== undefined) {
      where.isTrialActive = filters.isTrialActive;
    }

    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('tenant.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isTrialActive !== undefined) {
      queryBuilder.andWhere('tenant.isTrialActive = :isTrialActive', { isTrialActive: filters.isTrialActive });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(tenant.name LIKE :search OR tenant.subdomain LIKE :search OR tenant.contactEmail LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder
      .leftJoinAndSelect('tenant.schools', 'schools')
      .leftJoinAndSelect('tenant.subscriptions', 'subscriptions')
      .orderBy('tenant.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Get a single tenant by ID
   */
  async findOneTenant(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['schools', 'subscriptions'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  /**
   * Get tenant by subdomain
   */
  async findTenantBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain },
      relations: ['schools', 'subscriptions'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }

    return tenant;
  }

  /**
   * Update tenant details
   */
  async updateTenant(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOneTenant(id);

    // Check subdomain uniqueness if being updated
    if (updateTenantDto.subdomain && updateTenantDto.subdomain !== tenant.subdomain) {
      const existingTenant = await this.tenantRepository.findOne({
        where: { subdomain: updateTenantDto.subdomain },
      });

      if (existingTenant) {
        throw new ConflictException('Subdomain already exists');
      }
    }

    // Check domain uniqueness if being updated
    if (updateTenantDto.domain && updateTenantDto.domain !== tenant.domain) {
      const existingDomain = await this.tenantRepository.findOne({
        where: { domain: updateTenantDto.domain },
      });

      if (existingDomain) {
        throw new ConflictException('Domain already exists');
      }
    }

    Object.assign(tenant, updateTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  /**
   * Soft delete a tenant
   */
  async removeTenant(id: string): Promise<void> {
    const tenant = await this.findOneTenant(id);
    await this.tenantRepository.softDelete(id);
  }

  /**
   * Activate or deactivate a tenant
   */
  async toggleTenantStatus(id: string, isActive: boolean): Promise<Tenant> {
    const tenant = await this.findOneTenant(id);
    tenant.isActive = isActive;
    return await this.tenantRepository.save(tenant);
  }

  // ===================== SCHOOL OPERATIONS =====================

  /**
   * Create a new school under a tenant
   */
  async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    // Verify tenant exists
    const tenant = await this.findOneTenant(createSchoolDto.tenantId);

    if (!tenant.isActive) {
      throw new BadRequestException('Cannot create school for inactive tenant');
    }

    // Set default academic settings if not provided
    if (!createSchoolDto.academicSettings) {
      createSchoolDto.academicSettings = {
        gradingSystem: 'percentage',
        attendanceThreshold: 75,
        maxAbsenceDays: 30,
        examWeightage: {
          midterm: 30,
          final: 70,
        },
      };
    }

    // Set default fee settings if not provided
    if (!createSchoolDto.feeSettings) {
      createSchoolDto.feeSettings = {
        currency: tenant.settings?.currency || 'USD',
        lateFeePercentage: 5,
        gracePeriod: 7,
        installmentCount: 3,
      };
    }

    const school = this.schoolRepository.create(createSchoolDto);
    return await this.schoolRepository.save(school);
  }

  /**
   * Get all schools with optional tenant filter
   */
  async findAllSchools(tenantId?: string, filters?: {
    isActive?: boolean;
    search?: string;
  }): Promise<School[]> {
    const queryBuilder = this.schoolRepository.createQueryBuilder('school');

    if (tenantId) {
      queryBuilder.where('school.tenantId = :tenantId', { tenantId });
    }

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('school.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(school.name LIKE :search OR school.shortName LIKE :search OR school.city LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder
      .leftJoinAndSelect('school.tenant', 'tenant')
      .leftJoinAndSelect('school.academicYears', 'academicYears')
      .orderBy('school.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Get a single school by ID
   */
  async findOneSchool(id: string): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { id },
      relations: ['tenant', 'academicYears'],
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  /**
   * Get schools by tenant ID
   */
  async findSchoolsByTenant(tenantId: string): Promise<School[]> {
    return await this.schoolRepository.find({
      where: { tenantId },
      relations: ['academicYears'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update school details
   */
  async updateSchool(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findOneSchool(id);
    Object.assign(school, updateSchoolDto);
    return await this.schoolRepository.save(school);
  }

  /**
   * Soft delete a school
   */
  async removeSchool(id: string): Promise<void> {
    const school = await this.findOneSchool(id);
    await this.schoolRepository.softDelete(id);
  }

  /**
   * Activate or deactivate a school
   */
  async toggleSchoolStatus(id: string, isActive: boolean): Promise<School> {
    const school = await this.findOneSchool(id);
    school.isActive = isActive;
    return await this.schoolRepository.save(school);
  }

  // ===================== SUBSCRIPTION OPERATIONS =====================

  /**
   * Create a new subscription for a tenant
   */
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    // Verify tenant exists
    const tenant = await this.findOneTenant(createSubscriptionDto.tenantId);

    // Set default limits based on plan if not provided
    if (!createSubscriptionDto.studentLimit) {
      createSubscriptionDto.studentLimit = this.getDefaultLimitsForPlan(createSubscriptionDto.plan).students;
    }

    if (!createSubscriptionDto.staffLimit) {
      createSubscriptionDto.staffLimit = this.getDefaultLimitsForPlan(createSubscriptionDto.plan).staff;
    }

    if (!createSubscriptionDto.storageLimit) {
      createSubscriptionDto.storageLimit = this.getDefaultLimitsForPlan(createSubscriptionDto.plan).storage;
    }

    // Set default features based on plan
    if (!createSubscriptionDto.features) {
      createSubscriptionDto.features = this.getDefaultFeaturesForPlan(createSubscriptionDto.plan);
    }

    // Set default status if not provided
    if (!createSubscriptionDto.status) {
      createSubscriptionDto.status = SubscriptionStatus.ACTIVE;
    }

    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Get all subscriptions with optional tenant filter
   */
  async findAllSubscriptions(tenantId?: string, filters?: {
    status?: SubscriptionStatus;
    plan?: SubscriptionPlan;
  }): Promise<Subscription[]> {
    const where: FindOptionsWhere<Subscription> = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.plan) {
      where.plan = filters.plan;
    }

    return await this.subscriptionRepository.find({
      where,
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single subscription by ID
   */
  async findOneSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  /**
   * Get active subscription for a tenant
   */
  async findActiveSubscriptionByTenant(tenantId: string): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne({
      where: {
        tenantId,
        status: SubscriptionStatus.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update subscription details
   */
  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOneSubscription(id);
    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(id: string): Promise<Subscription> {
    const subscription = await this.findOneSubscription(id);
    subscription.status = SubscriptionStatus.CANCELLED;
    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Renew a subscription
   */
  async renewSubscription(id: string, endDate: Date): Promise<Subscription> {
    const subscription = await this.findOneSubscription(id);
    
    if (subscription.status !== SubscriptionStatus.ACTIVE && subscription.status !== SubscriptionStatus.EXPIRED) {
      throw new BadRequestException('Can only renew active or expired subscriptions');
    }

    subscription.endDate = endDate;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.lastPaymentDate = new Date();
    
    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Check if tenant has an active subscription
   */
  async hasActiveSubscription(tenantId: string): Promise<boolean> {
    const subscription = await this.findActiveSubscriptionByTenant(tenantId);
    
    if (!subscription) {
      return false;
    }

    // Check if subscription has expired
    if (new Date() > new Date(subscription.endDate)) {
      // Update subscription status to expired
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(subscription);
      return false;
    }

    return true;
  }

  /**
   * Get subscription limits for a tenant
   */
  async getSubscriptionLimits(tenantId: string): Promise<{
    studentLimit: number;
    staffLimit: number;
    storageLimit: number;
    features: string[];
  }> {
    const subscription = await this.findActiveSubscriptionByTenant(tenantId);

    if (!subscription) {
      throw new NotFoundException('No active subscription found for this tenant');
    }

    return {
      studentLimit: subscription.studentLimit,
      staffLimit: subscription.staffLimit,
      storageLimit: subscription.storageLimit,
      features: subscription.features || [],
    };
  }

  // ===================== HELPER METHODS =====================

  /**
   * Get default limits based on subscription plan
   */
  private getDefaultLimitsForPlan(plan: SubscriptionPlan): {
    students: number;
    staff: number;
    storage: number;
  } {
    const limits = {
      [SubscriptionPlan.BASIC]: { students: 100, staff: 10, storage: 5 },
      [SubscriptionPlan.STANDARD]: { students: 500, staff: 50, storage: 20 },
      [SubscriptionPlan.PREMIUM]: { students: 2000, staff: 200, storage: 100 },
      [SubscriptionPlan.ENTERPRISE]: { students: 10000, staff: 1000, storage: 500 },
      [SubscriptionPlan.CUSTOM]: { students: 0, staff: 0, storage: 0 },
    };

    return limits[plan];
  }

  /**
   * Get default features based on subscription plan
   */
  private getDefaultFeaturesForPlan(plan: SubscriptionPlan): string[] {
    const features = {
      [SubscriptionPlan.BASIC]: [
        'student_management',
        'attendance',
        'basic_reports',
      ],
      [SubscriptionPlan.STANDARD]: [
        'student_management',
        'attendance',
        'basic_reports',
        'exams',
        'fee_management',
        'parent_portal',
      ],
      [SubscriptionPlan.PREMIUM]: [
        'student_management',
        'attendance',
        'basic_reports',
        'exams',
        'fee_management',
        'parent_portal',
        'staff_management',
        'library',
        'transport',
        'hostel',
        'cbt',
        'analytics',
      ],
      [SubscriptionPlan.ENTERPRISE]: [
        'student_management',
        'attendance',
        'basic_reports',
        'exams',
        'fee_management',
        'parent_portal',
        'staff_management',
        'library',
        'transport',
        'hostel',
        'cbt',
        'analytics',
        'api_access',
        'custom_integrations',
        'priority_support',
        'white_label',
      ],
      [SubscriptionPlan.CUSTOM]: [],
    };

    return features[plan];
  }

  /**
   * Get tenant statistics
   */
  async getTenantStatistics(tenantId: string): Promise<{
    totalSchools: number;
    activeSchools: number;
    hasActiveSubscription: boolean;
    subscriptionPlan: string | null;
    subscriptionExpiresAt: Date | null;
  }> {
    const tenant = await this.findOneTenant(tenantId);
    const schools = await this.findSchoolsByTenant(tenantId);
    const activeSubscription = await this.findActiveSubscriptionByTenant(tenantId);

    return {
      totalSchools: schools.length,
      activeSchools: schools.filter(s => s.isActive).length,
      hasActiveSubscription: activeSubscription !== null,
      subscriptionPlan: activeSubscription?.plan || null,
      subscriptionExpiresAt: activeSubscription?.endDate || null,
    };
  }
}
