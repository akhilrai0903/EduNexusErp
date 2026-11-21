import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';
import { AcademicYear } from './entities/academic-year.entity';
import { Class } from './entities/class.entity';
import { ClassSection } from './entities/class-section.entity';
import { Subject } from './entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicYear,
      Class,
      ClassSection,
      Subject,
    ]),
  ],
  providers: [AcademicsService],
  controllers: [AcademicsController],
  exports: [AcademicsService],
})
export class AcademicsModule {}
