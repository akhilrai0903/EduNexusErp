import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Class } from './entities/class.entity';
import { ClassSection } from './entities/class-section.entity';
import { Subject } from './entities/subject.entity';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(AcademicYear)
    private academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassSection)
    private classSectionRepository: Repository<ClassSection>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  // ===================== ACADEMIC YEAR OPERATIONS =====================

  /**
   * Create a new academic year
   */
  async createAcademicYear(createDto: CreateAcademicYearDto): Promise<AcademicYear> {
    // Validate dates
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // If marked as current, unmark all other academic years for this school
    if (createDto.isCurrent) {
      await this.academicYearRepository.update(
        { schoolId: createDto.schoolId, isCurrent: true },
        { isCurrent: false }
      );
    }

    // Set default settings if not provided
    if (!createDto.settings) {
      createDto.settings = {
        gradingSystem: 'percentage',
        attendanceThreshold: 75,
        maxAbsenceDays: 30,
        workingDays: 200,
      };
    }

    const academicYear = this.academicYearRepository.create(createDto);
    return await this.academicYearRepository.save(academicYear);
  }

  /**
   * Get all academic years with optional filters
   */
  async findAllAcademicYears(filters?: {
    tenantId?: string;
    schoolId?: string;
    isCurrent?: boolean;
    isActive?: boolean;
  }): Promise<AcademicYear[]> {
    const where: FindOptionsWhere<AcademicYear> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.isCurrent !== undefined) where.isCurrent = filters.isCurrent;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return await this.academicYearRepository.find({
      where,
      relations: ['school', 'classes'],
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Get a single academic year by ID
   */
  async findOneAcademicYear(id: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.findOne({
      where: { id },
      relations: ['school', 'classes'],
    });

    if (!academicYear) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }

    return academicYear;
  }

  /**
   * Get current academic year for a school
   */
  async getCurrentAcademicYear(schoolId: string): Promise<AcademicYear | null> {
    return await this.academicYearRepository.findOne({
      where: { schoolId, isCurrent: true, isActive: true },
      relations: ['classes'],
    });
  }

  /**
   * Update academic year details
   */
  async updateAcademicYear(id: string, updateDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    const academicYear = await this.findOneAcademicYear(id);

    // Validate dates if both are provided
    if (updateDto.startDate && updateDto.endDate) {
      const startDate = new Date(updateDto.startDate);
      const endDate = new Date(updateDto.endDate);
      
      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // If marking as current, unmark all others
    if (updateDto.isCurrent) {
      await this.academicYearRepository.update(
        { schoolId: academicYear.schoolId, isCurrent: true },
        { isCurrent: false }
      );
    }

    Object.assign(academicYear, updateDto);
    return await this.academicYearRepository.save(academicYear);
  }

  /**
   * Soft delete an academic year
   */
  async removeAcademicYear(id: string): Promise<void> {
    const academicYear = await this.findOneAcademicYear(id);
    
    // Check if it's the current academic year
    if (academicYear.isCurrent) {
      throw new BadRequestException('Cannot delete the current academic year');
    }

    await this.academicYearRepository.softDelete(id);
  }

  /**
   * Set an academic year as current
   */
  async setCurrentAcademicYear(id: string): Promise<AcademicYear> {
    const academicYear = await this.findOneAcademicYear(id);

    // Unmark all other academic years for this school
    await this.academicYearRepository.update(
      { schoolId: academicYear.schoolId, isCurrent: true },
      { isCurrent: false }
    );

    academicYear.isCurrent = true;
    academicYear.isActive = true;
    return await this.academicYearRepository.save(academicYear);
  }

  // ===================== CLASS OPERATIONS =====================

  /**
   * Create a new class
   */
  async createClass(createDto: CreateClassDto): Promise<Class> {
    // Verify academic year exists and is active
    const academicYear = await this.findOneAcademicYear(createDto.academicYearId);
    
    if (!academicYear.isActive) {
      throw new BadRequestException('Cannot create class for inactive academic year');
    }

    // Set default settings if not provided
    if (!createDto.settings) {
      createDto.settings = {
        attendanceRequired: true,
        homeworkWeight: 20,
        examWeight: 70,
        projectWeight: 10,
      };
    }

    const classEntity = this.classRepository.create(createDto);
    return await this.classRepository.save(classEntity);
  }

  /**
   * Get all classes with optional filters
   */
  async findAllClasses(filters?: {
    tenantId?: string;
    schoolId?: string;
    academicYearId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<Class[]> {
    const queryBuilder = this.classRepository.createQueryBuilder('class');

    if (filters?.tenantId) {
      queryBuilder.andWhere('class.tenantId = :tenantId', { tenantId: filters.tenantId });
    }

    if (filters?.schoolId) {
      queryBuilder.andWhere('class.schoolId = :schoolId', { schoolId: filters.schoolId });
    }

    if (filters?.academicYearId) {
      queryBuilder.andWhere('class.academicYearId = :academicYearId', { academicYearId: filters.academicYearId });
    }

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('class.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(class.name LIKE :search OR class.shortName LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder
      .leftJoinAndSelect('class.academicYear', 'academicYear')
      .leftJoinAndSelect('class.sections', 'sections')
      .leftJoinAndSelect('class.subjects', 'subjects')
      .leftJoinAndSelect('class.students', 'students')
      .orderBy('class.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Get a single class by ID
   */
  async findOneClass(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['academicYear', 'sections', 'subjects', 'students'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classEntity;
  }

  /**
   * Get classes by academic year
   */
  async findClassesByAcademicYear(academicYearId: string): Promise<Class[]> {
    return await this.classRepository.find({
      where: { academicYearId },
      relations: ['sections', 'subjects', 'students'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Update class details
   */
  async updateClass(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findOneClass(id);
    Object.assign(classEntity, updateDto);
    return await this.classRepository.save(classEntity);
  }

  /**
   * Soft delete a class
   */
  async removeClass(id: string): Promise<void> {
    const classEntity = await this.findOneClass(id);
    await this.classRepository.softDelete(id);
  }

  /**
   * Toggle class active status
   */
  async toggleClassStatus(id: string, isActive: boolean): Promise<Class> {
    const classEntity = await this.findOneClass(id);
    classEntity.isActive = isActive;
    return await this.classRepository.save(classEntity);
  }

  // ===================== CLASS SECTION OPERATIONS =====================

  /**
   * Create a new class section
   */
  async createClassSection(createDto: CreateClassSectionDto): Promise<ClassSection> {
    // Verify class exists and is active
    const classEntity = await this.findOneClass(createDto.classId);
    
    if (!classEntity.isActive) {
      throw new BadRequestException('Cannot create section for inactive class');
    }

    const section = this.classSectionRepository.create(createDto);
    return await this.classSectionRepository.save(section);
  }

  /**
   * Get all class sections with optional filters
   */
  async findAllClassSections(filters?: {
    tenantId?: string;
    schoolId?: string;
    classId?: string;
    isActive?: boolean;
  }): Promise<ClassSection[]> {
    const where: FindOptionsWhere<ClassSection> = {};

    if (filters?.tenantId) where.tenantId = filters.tenantId;
    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.classId) where.classId = filters.classId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return await this.classSectionRepository.find({
      where,
      relations: ['class'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get a single class section by ID
   */
  async findOneClassSection(id: string): Promise<ClassSection> {
    const section = await this.classSectionRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!section) {
      throw new NotFoundException(`Class section with ID ${id} not found`);
    }

    return section;
  }

  /**
   * Get sections by class
   */
  async findSectionsByClass(classId: string): Promise<ClassSection[]> {
    return await this.classSectionRepository.find({
      where: { classId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Update class section details
   */
  async updateClassSection(id: string, updateDto: UpdateClassSectionDto): Promise<ClassSection> {
    const section = await this.findOneClassSection(id);
    Object.assign(section, updateDto);
    return await this.classSectionRepository.save(section);
  }

  /**
   * Soft delete a class section
   */
  async removeClassSection(id: string): Promise<void> {
    const section = await this.findOneClassSection(id);
    await this.classSectionRepository.softDelete(id);
  }

  /**
   * Toggle section active status
   */
  async toggleClassSectionStatus(id: string, isActive: boolean): Promise<ClassSection> {
    const section = await this.findOneClassSection(id);
    section.isActive = isActive;
    return await this.classSectionRepository.save(section);
  }

  // ===================== SUBJECT OPERATIONS =====================

  /**
   * Create a new subject
   */
  async createSubject(createDto: CreateSubjectDto): Promise<Subject> {
    // Verify class exists and is active
    const classEntity = await this.findOneClass(createDto.classId);
    
    if (!classEntity.isActive) {
      throw new BadRequestException('Cannot create subject for inactive class');
    }

    // Check if subject code is unique within the class if provided
    if (createDto.code) {
      const existingSubject = await this.subjectRepository.findOne({
        where: {
          classId: createDto.classId,
          code: createDto.code,
        },
      });

      if (existingSubject) {
        throw new ConflictException('Subject code already exists for this class');
      }
    }

    // Set default assessment weights if not provided
    if (!createDto.assessmentWeights) {
      createDto.assessmentWeights = {
        homework: 10,
        quiz: 15,
        midterm: 25,
        final: 40,
        project: 5,
        attendance: 5,
      };
    }

    const subject = this.subjectRepository.create(createDto);
    return await this.subjectRepository.save(subject);
  }

  /**
   * Get all subjects with optional filters
   */
  async findAllSubjects(filters?: {
    tenantId?: string;
    schoolId?: string;
    classId?: string;
    type?: string;
    category?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<Subject[]> {
    const queryBuilder = this.subjectRepository.createQueryBuilder('subject');

    if (filters?.tenantId) {
      queryBuilder.andWhere('subject.tenantId = :tenantId', { tenantId: filters.tenantId });
    }

    if (filters?.schoolId) {
      queryBuilder.andWhere('subject.schoolId = :schoolId', { schoolId: filters.schoolId });
    }

    if (filters?.classId) {
      queryBuilder.andWhere('subject.classId = :classId', { classId: filters.classId });
    }

    if (filters?.type) {
      queryBuilder.andWhere('subject.type = :type', { type: filters.type });
    }

    if (filters?.category) {
      queryBuilder.andWhere('subject.category = :category', { category: filters.category });
    }

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere('subject.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(subject.name LIKE :search OR subject.code LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder
      .leftJoinAndSelect('subject.class', 'class')
      .orderBy('subject.name', 'ASC');

    return await queryBuilder.getMany();
  }

  /**
   * Get a single subject by ID
   */
  async findOneSubject(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  /**
   * Get subjects by class
   */
  async findSubjectsByClass(classId: string): Promise<Subject[]> {
    return await this.subjectRepository.find({
      where: { classId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Update subject details
   */
  async updateSubject(id: string, updateDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOneSubject(id);

    // Check if subject code is being updated and is unique
    if (updateDto.code && updateDto.code !== subject.code) {
      const existingSubject = await this.subjectRepository.findOne({
        where: {
          classId: subject.classId,
          code: updateDto.code,
        },
      });

      if (existingSubject) {
        throw new ConflictException('Subject code already exists for this class');
      }
    }

    Object.assign(subject, updateDto);
    return await this.subjectRepository.save(subject);
  }

  /**
   * Soft delete a subject
   */
  async removeSubject(id: string): Promise<void> {
    const subject = await this.findOneSubject(id);
    await this.subjectRepository.softDelete(id);
  }

  /**
   * Toggle subject active status
   */
  async toggleSubjectStatus(id: string, isActive: boolean): Promise<Subject> {
    const subject = await this.findOneSubject(id);
    subject.isActive = isActive;
    return await this.subjectRepository.save(subject);
  }

  // ===================== HELPER & STATISTICS METHODS =====================

  /**
   * Get academic year statistics
   */
  async getAcademicYearStatistics(academicYearId: string): Promise<{
    totalClasses: number;
    totalSections: number;
    totalSubjects: number;
    totalStudents: number;
  }> {
    const academicYear = await this.findOneAcademicYear(academicYearId);
    const classes = await this.findClassesByAcademicYear(academicYearId);

    let totalSections = 0;
    let totalSubjects = 0;
    let totalStudents = 0;

    for (const classEntity of classes) {
      const sections = await this.findSectionsByClass(classEntity.id);
      const subjects = await this.findSubjectsByClass(classEntity.id);
      
      totalSections += sections.length;
      totalSubjects += subjects.length;
      totalStudents += classEntity.students?.length || 0;
    }

    return {
      totalClasses: classes.length,
      totalSections,
      totalSubjects,
      totalStudents,
    };
  }

  /**
   * Get class statistics
   */
  async getClassStatistics(classId: string): Promise<{
    totalSections: number;
    totalSubjects: number;
    totalStudents: number;
    maxStudents: number;
    availableSeats: number;
  }> {
    const classEntity = await this.findOneClass(classId);
    const sections = await this.findSectionsByClass(classId);
    const subjects = await this.findSubjectsByClass(classId);

    const totalStudents = classEntity.students?.length || 0;
    const maxStudents = classEntity.maxStudents || 0;
    const availableSeats = maxStudents > 0 ? maxStudents - totalStudents : 0;

    return {
      totalSections: sections.length,
      totalSubjects: subjects.length,
      totalStudents,
      maxStudents,
      availableSeats,
    };
  }
}
