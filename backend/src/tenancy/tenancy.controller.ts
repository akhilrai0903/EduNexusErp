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
import { TenancyService } from './tenancy.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { SubscriptionStatus } from './enums/subscription-status.enum';
import { SubscriptionPlan } from './enums/subscription-plan.enum';

@Controller('tenancy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) {}

  // ===================== TENANT ENDPOINTS =====================

  @Post('tenants')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenancyService.createTenant(createTenantDto);
  }

  @Get('tenants')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findAllTenants(
    @Query('isActive') isActive?: string,
    @Query('isTrialActive') isTrialActive?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (isTrialActive !== undefined) {
      filters.isTrialActive = isTrialActive === 'true';
    }
    
    if (search) {
      filters.search = search;
    }

    return await this.tenancyService.findAllTenants(filters);
  }

  @Get('tenants/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findOneTenant(@Param('id') id: string) {
    return await this.tenancyService.findOneTenant(id);
  }

  @Get('tenants/subdomain/:subdomain')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findTenantBySubdomain(@Param('subdomain') subdomain: string) {
    return await this.tenancyService.findTenantBySubdomain(subdomain);
  }

  @Patch('tenants/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return await this.tenancyService.updateTenant(id, updateTenantDto);
  }

  @Delete('tenants/:id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTenant(@Param('id') id: string) {
    return await this.tenancyService.removeTenant(id);
  }

  @Patch('tenants/:id/status')
  @Roles(Role.SUPER_ADMIN)
  async toggleTenantStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.tenancyService.toggleTenantStatus(id, isActive);
  }

  @Get('tenants/:id/statistics')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getTenantStatistics(@Param('id') id: string) {
    return await this.tenancyService.getTenantStatistics(id);
  }

  // ===================== SCHOOL ENDPOINTS =====================

  @Post('schools')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.tenancyService.createSchool(createSchoolDto);
  }

  @Get('schools')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER)
  async findAllSchools(
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (search) {
      filters.search = search;
    }

    return await this.tenancyService.findAllSchools(tenantId, filters);
  }

  @Get('schools/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findOneSchool(@Param('id') id: string) {
    return await this.tenancyService.findOneSchool(id);
  }

  @Get('tenants/:tenantId/schools')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findSchoolsByTenant(@Param('tenantId') tenantId: string) {
    return await this.tenancyService.findSchoolsByTenant(tenantId);
  }

  @Patch('schools/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateSchool(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return await this.tenancyService.updateSchool(id, updateSchoolDto);
  }

  @Delete('schools/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSchool(@Param('id') id: string) {
    return await this.tenancyService.removeSchool(id);
  }

  @Patch('schools/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async toggleSchoolStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.tenancyService.toggleSchoolStatus(id, isActive);
  }

  // ===================== SUBSCRIPTION ENDPOINTS =====================

  @Post('subscriptions')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.tenancyService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findAllSubscriptions(
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: SubscriptionStatus,
    @Query('plan') plan?: SubscriptionPlan,
  ) {
    const filters: any = {};
    
    if (status) {
      filters.status = status;
    }
    
    if (plan) {
      filters.plan = plan;
    }

    return await this.tenancyService.findAllSubscriptions(tenantId, filters);
  }

  @Get('subscriptions/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findOneSubscription(@Param('id') id: string) {
    return await this.tenancyService.findOneSubscription(id);
  }

  @Get('tenants/:tenantId/subscription/active')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async findActiveSubscriptionByTenant(@Param('tenantId') tenantId: string) {
    return await this.tenancyService.findActiveSubscriptionByTenant(tenantId);
  }

  @Patch('subscriptions/:id')
  @Roles(Role.SUPER_ADMIN)
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.tenancyService.updateSubscription(id, updateSubscriptionDto);
  }

  @Post('subscriptions/:id/cancel')
  @Roles(Role.SUPER_ADMIN)
  async cancelSubscription(@Param('id') id: string) {
    return await this.tenancyService.cancelSubscription(id);
  }

  @Post('subscriptions/:id/renew')
  @Roles(Role.SUPER_ADMIN)
  async renewSubscription(
    @Param('id') id: string,
    @Body('endDate') endDate: Date,
  ) {
    return await this.tenancyService.renewSubscription(id, endDate);
  }

  @Get('tenants/:tenantId/subscription/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async hasActiveSubscription(@Param('tenantId') tenantId: string) {
    const hasActive = await this.tenancyService.hasActiveSubscription(tenantId);
    return { hasActiveSubscription: hasActive };
  }

  @Get('tenants/:tenantId/subscription/limits')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getSubscriptionLimits(@Param('tenantId') tenantId: string) {
    return await this.tenancyService.getSubscriptionLimits(tenantId);
  }
}
