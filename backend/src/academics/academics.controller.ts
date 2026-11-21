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
import { AcademicsService } from './academics.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('academics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  // ===================== ACADEMIC YEAR ENDPOINTS =====================

  @Post('academic-years')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.CREATED)
  async createAcademicYear(@Body() createDto: CreateAcademicYearDto) {
    return await this.academicsService.createAcademicYear(createDto);
  }

  @Get('academic-years')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER)
  async findAllAcademicYears(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('isCurrent') isCurrent?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (isCurrent !== undefined) filters.isCurrent = isCurrent === 'true';
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return await this.academicsService.findAllAcademicYears(filters);
  }

  @Get('academic-years/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findOneAcademicYear(@Param('id') id: string) {
    return await this.academicsService.findOneAcademicYear(id);
  }

  @Get('schools/:schoolId/academic-years/current')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async getCurrentAcademicYear(@Param('schoolId') schoolId: string) {
    return await this.academicsService.getCurrentAcademicYear(schoolId);
  }

  @Patch('academic-years/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async updateAcademicYear(
    @Param('id') id: string,
    @Body() updateDto: UpdateAcademicYearDto,
  ) {
    return await this.academicsService.updateAcademicYear(id, updateDto);
  }

  @Delete('academic-years/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAcademicYear(@Param('id') id: string) {
    return await this.academicsService.removeAcademicYear(id);
  }

  @Post('academic-years/:id/set-current')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async setCurrentAcademicYear(@Param('id') id: string) {
    return await this.academicsService.setCurrentAcademicYear(id);
  }

  @Get('academic-years/:id/statistics')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async getAcademicYearStatistics(@Param('id') id: string) {
    return await this.academicsService.getAcademicYearStatistics(id);
  }

  // ===================== CLASS ENDPOINTS =====================

  @Post('classes')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.CREATED)
  async createClass(@Body() createDto: CreateClassDto) {
    return await this.academicsService.createClass(createDto);
  }

  @Get('classes')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findAllClasses(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('academicYearId') academicYearId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (academicYearId) filters.academicYearId = academicYearId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search;

    return await this.academicsService.findAllClasses(filters);
  }

  @Get('classes/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findOneClass(@Param('id') id: string) {
    return await this.academicsService.findOneClass(id);
  }

  @Get('academic-years/:academicYearId/classes')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER)
  async findClassesByAcademicYear(@Param('academicYearId') academicYearId: string) {
    return await this.academicsService.findClassesByAcademicYear(academicYearId);
  }

  @Patch('classes/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async updateClass(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassDto,
  ) {
    return await this.academicsService.updateClass(id, updateDto);
  }

  @Delete('classes/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeClass(@Param('id') id: string) {
    return await this.academicsService.removeClass(id);
  }

  @Patch('classes/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async toggleClassStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.academicsService.toggleClassStatus(id, isActive);
  }

  @Get('classes/:id/statistics')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER)
  async getClassStatistics(@Param('id') id: string) {
    return await this.academicsService.getClassStatistics(id);
  }

  // ===================== CLASS SECTION ENDPOINTS =====================

  @Post('class-sections')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.CREATED)
  async createClassSection(@Body() createDto: CreateClassSectionDto) {
    return await this.academicsService.createClassSection(createDto);
  }

  @Get('class-sections')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findAllClassSections(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('classId') classId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (classId) filters.classId = classId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return await this.academicsService.findAllClassSections(filters);
  }

  @Get('class-sections/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findOneClassSection(@Param('id') id: string) {
    return await this.academicsService.findOneClassSection(id);
  }

  @Get('classes/:classId/sections')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER)
  async findSectionsByClass(@Param('classId') classId: string) {
    return await this.academicsService.findSectionsByClass(classId);
  }

  @Patch('class-sections/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async updateClassSection(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassSectionDto,
  ) {
    return await this.academicsService.updateClassSection(id, updateDto);
  }

  @Delete('class-sections/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeClassSection(@Param('id') id: string) {
    return await this.academicsService.removeClassSection(id);
  }

  @Patch('class-sections/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async toggleClassSectionStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.academicsService.toggleClassSectionStatus(id, isActive);
  }

  // ===================== SUBJECT ENDPOINTS =====================

  @Post('subjects')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
  @HttpCode(HttpStatus.CREATED)
  async createSubject(@Body() createDto: CreateSubjectDto) {
    return await this.academicsService.createSubject(createDto);
  }

  @Get('subjects')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findAllSubjects(
    @Query('tenantId') tenantId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('classId') classId?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    
    if (tenantId) filters.tenantId = tenantId;
    if (schoolId) filters.schoolId = schoolId;
    if (classId) filters.classId = classId;
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search;

    return await this.academicsService.findAllSubjects(filters);
  }

  @Get('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findOneSubject(@Param('id') id: string) {
    return await this.academicsService.findOneSubject(id);
  }

  @Get('classes/:classId/subjects')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  async findSubjectsByClass(@Param('classId') classId: string) {
    return await this.academicsService.findSubjectsByClass(classId);
  }

  @Patch('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL, Role.HEAD_TEACHER)
  async updateSubject(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubjectDto,
  ) {
    return await this.academicsService.updateSubject(id, updateDto);
  }

  @Delete('subjects/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSubject(@Param('id') id: string) {
    return await this.academicsService.removeSubject(id);
  }

  @Patch('subjects/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PRINCIPAL)
  async toggleSubjectStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.academicsService.toggleSubjectStatus(id, isActive);
  }
}
