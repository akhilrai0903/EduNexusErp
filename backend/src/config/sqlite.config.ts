import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// Base entities
import { BaseEntity } from '../common/entities/base.entity';
import { TenantBaseEntity } from '../common/entities/tenant-base.entity';

// Auth entities
import { User } from '../auth/entities/user.entity';
import { UserProfile } from '../auth/entities/user-profile.entity';
import { LoginSession } from '../auth/entities/login-session.entity';

// Tenancy entities
import { Tenant } from '../tenancy/entities/tenant.entity';
import { School } from '../tenancy/entities/school.entity';
import { Subscription } from '../tenancy/entities/subscription.entity';

// SIS entities
import { Student } from '../sis/entities/student.entity';
import { StudentGuardian } from '../sis/entities/student-guardian.entity';
import { StudentDocument } from '../sis/entities/student-document.entity';

// Academics entities
import { AcademicYear } from '../academics/entities/academic-year.entity';
import { Class } from '../academics/entities/class.entity';
import { ClassSection } from '../academics/entities/class-section.entity';
import { Subject } from '../academics/entities/subject.entity';

// Staff entities
import { Staff } from '../staff/entities/staff.entity';
import { Department } from '../staff/entities/department.entity';
import { StaffDocument } from '../staff/entities/staff-document.entity';
import { StaffLeave } from '../staff/entities/staff-leave.entity';
import { StaffSalary } from '../staff/entities/staff-salary.entity';

// Exams entities
import { Exam } from '../exams/entities/exam.entity';
import { ExamSchedule } from '../exams/entities/exam-schedule.entity';
import { ExamResult } from '../exams/entities/exam-result.entity';

// CBT entities
import { CbtExam } from '../cbt/entities/cbt-exam.entity';
import { CbtQuestion } from '../cbt/entities/cbt-question.entity';
import { CbtQuestionOption } from '../cbt/entities/cbt-question-option.entity';
import { CbtAttempt } from '../cbt/entities/cbt-attempt.entity';

// Finance entities
import { FeeStructure } from '../finance/entities/fee-structure.entity';
import { FeeComponent } from '../finance/entities/fee-component.entity';
import { StudentFee } from '../finance/entities/student-fee.entity';
import { Payment } from '../finance/entities/payment.entity';

export const getSqliteConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: 'school_suite.db',
  
  // Entities
  entities: [
    // Base entities
    BaseEntity,
    TenantBaseEntity,
    
    // Auth entities
    User,
    UserProfile,
    LoginSession,
    
    // Tenancy entities
    Tenant,
    School,
    Subscription,
    
    // SIS entities
    Student,
    StudentGuardian,
    StudentDocument,
    
    // Academics entities
    AcademicYear,
    Class,
    ClassSection,
    Subject,
    
    // Staff entities
    Staff,
    Department,
    StaffDocument,
    StaffLeave,
    StaffSalary,
    
    // Exams entities
    Exam,
    ExamSchedule,
    ExamResult,
    
    // CBT entities
    CbtExam,
    CbtQuestion,
    CbtQuestionOption,
    CbtAttempt,
    
    // Finance entities
    FeeStructure,
    FeeComponent,
    StudentFee,
    Payment,
  ],
  
  // Auto-load entities
  autoLoadEntities: true,
  
  // Synchronization (set to false in production)
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  
  // Logging
  logging: configService.get<string>('NODE_ENV') === 'development',
  
  // SQLite specific options
  extra: {
    charset: 'utf8',
  },
});
