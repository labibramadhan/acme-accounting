import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { TicketModule } from './modules/tickets/ticket.module';
import { ReportModule } from './modules/reports/report.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './core/config/utils/config.util';

@Module({
  imports: [
    DbModule,
    HealthcheckModule,
    TicketModule,
    ReportModule,
    UserModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => loadConfig(process.cwd())],
    }),
  ],
})
export class AppModule {}
