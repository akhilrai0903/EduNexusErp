import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { TenancyModule } from './tenancy/tenancy.module';
import { AuthModule } from './auth/auth.module';
import { SisModule } from './sis/sis.module';
import { StaffModule } from './staff/staff.module';
import { AcademicsModule } from './academics/academics.module';
import { ExamsModule } from './exams/exams.module';
import { FinanceModule } from './finance/finance.module';
import { CommsModule } from './comms/comms.module';
import { LibraryModule } from './library/library.module';
import { HostelModule } from './hostel/hostel.module';
import { TransportModule } from './transport/transport.module';
import { InventoryModule } from './inventory/inventory.module';
import { PortalParentModule } from './portal-parent/portal-parent.module';
import { PortalStudentModule } from './portal-student/portal-student.module';
import { PtaModule } from './pta/pta.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CbtModule } from './cbt/cbt.module';
import { getDatabaseConfig } from './config/database.config';
import { getSqliteConfig } from './config/sqlite.config';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [() => require('./config/environment.config').environmentConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Use SQLite for development if PostgreSQL is not available
        const useSqlite = process.env.USE_SQLITE === 'true' || !process.env.DB_HOST;
        return useSqlite ? getSqliteConfig(configService) : getDatabaseConfig(configService);
      },
    }),
    // GraphQLModule temporarily disabled - uncomment when entities are GraphQL-ready
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   sortSchema: true,
    //   playground: true,
    // }),
    TenancyModule,
    AuthModule,
    SisModule,
    StaffModule,
    AcademicsModule,
    ExamsModule,
    FinanceModule,
    CommsModule,
    LibraryModule,
    HostelModule,
    TransportModule,
    InventoryModule,
    PortalParentModule,
    PortalStudentModule,
    PtaModule,
    AnalyticsModule,
    CbtModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
