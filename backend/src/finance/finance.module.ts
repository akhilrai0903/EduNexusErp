import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeeComponent } from './entities/fee-component.entity';
import { StudentFee } from './entities/student-fee.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeeStructure,
      FeeComponent,
      StudentFee,
      Payment,
    ]),
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}
