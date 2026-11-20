import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';
import { Tenant } from './entities/tenant.entity';
import { School } from './entities/school.entity';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      School,
      Subscription,
    ]),
  ],
  providers: [TenancyService],
  controllers: [TenancyController],
  exports: [TenancyService],
})
export class TenancyModule {}
