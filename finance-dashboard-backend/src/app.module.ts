import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './modules/finance/finance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuditLogModule } from './common/audit/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-dashboard'),
    UsersModule,
    AuthModule,
    FinanceModule,
    DashboardModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, // Increased limit for enterprise-scale dashboard updates
    }]),
    AuditLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
